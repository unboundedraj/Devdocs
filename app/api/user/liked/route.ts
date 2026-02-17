import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findUserByEmail, getApplicationByUid } from '@/lib/contentstack-management-queries';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ likedApplicationUids: [], likedApplications: [] }, { status: 200 });
  }

  try {
    const user = await findUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ likedApplicationUids: [], likedApplications: [] }, { status: 200 });
    }

    const likedApps = user.liked_applications || [];
    const likedUids = likedApps.map((app: any) => app.uid).filter(Boolean);

    // Fetch full application details to get titles
    const likedApplicationsWithTitles = await Promise.all(
      likedUids.map(async (uid: string) => {
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
      likedApplicationUids: likedUids,
      likedApplications: likedApplicationsWithTitles,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching liked applications:', error);
    return NextResponse.json({ likedApplicationUids: [], likedApplications: [] }, { status: 200 });
  }
}
