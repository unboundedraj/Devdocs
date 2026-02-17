import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findUserByEmail, getApplicationByUid } from '@/lib/contentstack-management-queries';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { upvotedApplicationUids: [], upvotedApplications: [] },
      { status: 200 }
    );
  }

  try {
    const user = await findUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { upvotedApplicationUids: [], upvotedApplications: [] },
        { status: 200 }
      );
    }

    const upvotedApps = user.upvoted_applications || [];
    const upvotedUids = upvotedApps.map((app: any) => app.uid).filter(Boolean);

    // Fetch full application details to get titles
    const upvotedApplicationsWithTitles = await Promise.all(
      upvotedUids.map(async (uid: string) => {
        try {
          const app = await getApplicationByUid(uid);
          return {
            uid: uid,
            title: app?.title || uid,
          };
        } catch (error) {
          console.error(`Error fetching application ${uid}:`, error);
          return { uid: uid, title: uid };
        }
      })
    );

    return NextResponse.json({
      upvotedApplicationUids: upvotedUids,
      upvotedApplications: upvotedApplicationsWithTitles,
    });
  } catch (error) {
    console.error('Error fetching upvoted applications:', error);
    return NextResponse.json(
      { upvotedApplicationUids: [], upvotedApplications: [] },
      { status: 200 }
    );
  }
}
