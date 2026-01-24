'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

type AppRef = {
  uid: string;
  title?: string;
};


type Profile = {
  upvoted_applications?: AppRef[];
  liked_applications?: AppRef[];
};

export default function ProfileClient({ profile }: { profile: Profile }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-12 h-12 rounded-full border-4 border-theme-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const upvotedApps = profile?.upvoted_applications ?? [];
  const likedApps = profile?.liked_applications ?? [];

  return (
    <div className="min-h-screen bg-theme-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-theme-primary/10 to-theme-secondary/10 rounded-2xl p-8 sm:p-12 border border-theme shadow-lg mb-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt={session?.user?.name || 'User'}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-theme-primary shadow-xl flex-shrink-0"
            />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-theme-accent mb-2">
                {session?.user?.name}
              </h1>
              <p className="text-theme-secondary text-lg">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-theme-card border border-theme rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center group">
            <div className="text-4xl sm:text-5xl font-bold text-theme-accent mb-2 group-hover:scale-110 transition-transform duration-300">
              {upvotedApps.length}
            </div>
            <p className="text-theme-secondary text-base">
              Upvoted Applications
            </p>
          </div>

          <div className="bg-theme-card border border-theme rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center group">
            <div className="text-4xl sm:text-5xl font-bold text-theme-secondary mb-2 group-hover:scale-110 transition-transform duration-300">
              {likedApps.length}
            </div>
            <p className="text-theme-secondary text-base">
              Liked Applications
            </p>
          </div>
        </div>

        {/* Upvoted Applications */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-theme-accent mb-2">
              ⭐ Upvoted Applications
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full" />
          </div>

          {upvotedApps.length === 0 ? (
            <div className="bg-theme-card border border-dashed border-theme rounded-xl p-8 text-center">
              <p className="text-theme-secondary text-lg">
                You haven't upvoted any applications yet.
              </p>
              <Link
                href="/applications"
                className="inline-block mt-4 px-6 py-2 bg-theme-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Explore Applications
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upvotedApps.map((app) => (
                <Link
                  key={app.uid}
                  href={`/applications/${app.uid}`}
                  className="group bg-theme-card border border-theme rounded-lg p-6 hover:border-theme-primary transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📌</span>
                    <span className="text-theme-accent font-semibold group-hover:text-theme-secondary transition-colors duration-300 flex-1 truncate">
                      {app.title || app.uid}
                    </span>
                    <span className="text-theme-secondary group-hover:text-theme-accent transition-colors duration-300">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
