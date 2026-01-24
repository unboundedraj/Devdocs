import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE = 'https://api.contentstack.io/v3';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(
    `${API_BASE}/content_types/users/entries` +
      `?query=${encodeURIComponent(
        JSON.stringify({ email: session.user.email })
      )}` +
      `&include[]=upvoted_applications` +
      `&include[]=liked_applications`,
    {
      headers: {
        api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error('Profile fetch failed:', text);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }

  const json = await res.json();
  const user = json.entries?.[0];

  return NextResponse.json({
    profile: user,
  });
}
