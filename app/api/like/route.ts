import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE = 'https://api.contentstack.io/v3';

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
    const userRes = await fetch(
      `${API_BASE}/content_types/users/entries?query=${encodeURIComponent(
        JSON.stringify({ email: session.user.email })
      )}`,
      {
        headers: {
          api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
        },
      }
    );

    if (!userRes.ok) {
      const details = await userRes.text();
      console.error('Failed to fetch user entry:', details);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 502 }
      );
    }

    const userJson = await userRes.json();
    const user = userJson.entries?.[0];

    if (!user) {
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

    // Update user liked_applications
    const updateUserRes = await fetch(
      `${API_BASE}/content_types/users/entries/${user.uid}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
        },
        body: JSON.stringify({
          entry: {
            liked_applications: [
              ...likedApps.map((a: any) => ({
                uid: a.uid,
                _content_type_uid: 'application',
              })),
              {
                uid: applicationUid,
                _content_type_uid: 'application',
              },
            ],
          },
        }),
      }
    );

    if (!updateUserRes.ok) {
      const details = await updateUserRes.text();
      console.error('Failed to update user liked_applications:', details);
      return NextResponse.json(
        { error: 'Failed to update user likes' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, alreadyLiked: false });
  } catch (error) {
    console.error('Like failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
