import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ProfileClient from './ProfileClient';
import DeliveryStack from '@/lib/contentstack';

async function getUserProfile(email: string) {
  try {
    const response = await DeliveryStack.ContentType('users')
      .Query()
      .where('email', email)
      .includeReference(['upvoted_applications', 'liked_applications'])
      .toJSON()
      .find();

    if (response?.[0] && response[0].length > 0) {
      return response[0][0];
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
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
