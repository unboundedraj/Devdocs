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

    // Step 4: Increment upvotes on the application
    const { upvotes: nextUpvotes } = await incrementApplicationUpvotes(applicationUid);

    // Step 5: Publish the application so upvote count is visible
    await publishEntry({
      contentTypeUid: 'application',
      entryUid: applicationUid,
      environments: [process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!],
      locales: [app?.locale || 'en-us'],
    });

    // Step 6: Update user's upvoted_applications
    await addUpvotedApplication(user.uid, applicationUid);

    // Step 7: Publish the user entry so Delivery API reflects the change
    await publishEntry({
      contentTypeUid: 'users',
      entryUid: user.uid,
      environments: [process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!],
      locales: [user.locale || 'en-us'],
    });

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
