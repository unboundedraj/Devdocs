import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  findUserByEmail,
  getApplicationByUid,
  incrementApplicationUpvotes,
  addUpvotedApplication,
  publishEntry,
} from '@/lib/contentstack-management-queries';

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
    // Step 1: Fetch user entry
    const user = await findUserByEmail(session.user.email);

    if (!user) {
      console.error('User not found:', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const upvotedApps = user.upvoted_applications || [];

    // Step 2: Guard — already upvoted?
    if (upvotedApps.some((app: any) => app.uid === applicationUid)) {
      const app = await getApplicationByUid(applicationUid);
      return NextResponse.json({
        success: true,
        alreadyUpvoted: true,
        upvotes: app?.upvotes || 0,
      });
    }

    // Step 3: Fetch application
    const app = await getApplicationByUid(applicationUid);

    if (!app) {
      console.error('Application not found for UID:', applicationUid);
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Step 4: Increment upvotes
    const { upvotes: nextUpvotes } = await incrementApplicationUpvotes(applicationUid);

    // Step 4b: Publish the entry
    try {
      await publishEntry({
        contentTypeUid: 'application',
        entryUid: applicationUid,
        environments: [process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!],
        locales: [app?.locale || 'en-us'],
      });
    } catch (publishError) {
      console.error('Failed to publish application after upvote:', publishError);
      // We still return success - publishing is non-critical
    }

    // Step 5: Update user's upvoted_applications
    await addUpvotedApplication(user.uid, applicationUid);

    // Step 6: Publish the user entry to make changes visible
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
      console.error('✗ Failed to publish user entry after upvote:');
      console.error('Error details:', publishError);
      console.error('Error message:', publishError instanceof Error ? publishError.message : 'Unknown');
      // Non-critical - user update succeeded
    }

    return NextResponse.json({
      success: true,
      alreadyUpvoted: false,
      upvotes: nextUpvotes,
    });
  } catch (error) {
    console.error('Upvote failed - Error details:', {
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
