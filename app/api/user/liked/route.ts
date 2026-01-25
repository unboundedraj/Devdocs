import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE = 'https://api.contentstack.io/v3';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ likedApplicationUids: [] }, { status: 200 });
  }

  try {
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
      return NextResponse.json({ likedApplicationUids: [] }, { status: 200 });
    }

    const userJson = await userRes.json();
    const user = userJson.entries?.[0];

    if (!user) {
      return NextResponse.json({ likedApplicationUids: [] }, { status: 200 });
    }

    const likedApps = user.liked_applications || [];
    const likedUids = likedApps.map((app: any) => app.uid).filter(Boolean);

    return NextResponse.json({ likedApplicationUids: likedUids }, { status: 200 });
  } catch (error) {
    console.error('Error fetching liked applications:', error);
    return NextResponse.json({ likedApplicationUids: [] }, { status: 200 });
  }
}
