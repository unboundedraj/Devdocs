import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findUserByEmail, addLikedApplication, publishEntry } from '@/lib/contentstack-management-queries';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { applicationUid } = await req.json();

  if (!applicationUid) {
    return NextResponse.json(
      { error: 'Missing application UID' },
      { status: 400 }
    );
  }

  try {
    // Fetch user entry
    const user = await findUserByEmail(session.user.email);

    if (!user) {
      console.error('User not found for email:', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const likedApps = user.liked_applications || [];

    // Guard: already liked
    if (likedApps.some((app: any) => app.uid === applicationUid)) {
      return NextResponse.json({ success: true, alreadyLiked: true });
    }

    // Add to liked applications
    await addLikedApplication(user.uid, applicationUid);

    // Publish the user entry to make changes visible
    console.log('Attempting to publish user entry:', user.uid);
    console.log('Environment:', process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT);
    try {
      const published = await publishEntry({
        contentTypeUid: 'users',
        entryUid: user.uid,
        environments: [process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!],
        locales: ['en-us'],
      });
      console.log('✓ User entry published successfully:', published);
    } catch (publishError) {
      console.error('✗ Failed to publish user entry after like:');
      console.error('Error details:', publishError);
      console.error('Error message:', publishError instanceof Error ? publishError.message : 'Unknown');
      // Non-critical - user update succeeded
    }

    return NextResponse.json({ success: true, alreadyLiked: false });
  } catch (error) {
    console.error('Like failed - Error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
