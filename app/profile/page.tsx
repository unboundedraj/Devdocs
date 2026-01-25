import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ProfileClient from './ProfileClient';

const API_BASE = 'https://api.contentstack.io/v3';

async function getUserProfile(email: string) {
  const query = encodeURIComponent(JSON.stringify({ email }));

  const res = await fetch(
    `${API_BASE}/content_types/users/entries?query=${query}&include[]=upvoted_applications&include[]=liked_applications`,
    {
      headers: {
        api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch user profile');
    return null;
  }

  const data = await res.json();
  return data.entries?.[0] || null;
}



export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-theme-secondary">
        Please sign in to view your profile.
      </div>
    );
  }

  const profile = await getUserProfile(session.user.email);

  return <ProfileClient profile={profile} />;
}
