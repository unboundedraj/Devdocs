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
      <div className="flex justify-center items-center py-32 bg-theme-background min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-theme-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const upvotedApps = profile?.upvoted_applications ?? [];
  const likedApps = profile?.liked_applications ?? [];

  return (
    <div className="min-h-screen bg-theme-background text-white">
      {/* Hero Section - Profile Header */}
      <section className="relative bg-theme-background text-white py-16 px-6 border-b border-theme overflow-hidden">
        <canvas
          ref={(canvas) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const particles: any[] = [];
            const particleCount = 30;

            class Particle {
              x: number;
              y: number;
              size: number;
              speedX: number;
              speedY: number;

              constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
              }

              update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas!.width) this.x = 0;
                if (this.x < 0) this.x = canvas!.width;
                if (this.y > canvas!.height) this.y = 0;
                if (this.y < 0) this.y = canvas!.height;
              }

              draw() {
                ctx!.fillStyle = 'rgba(156, 163, 175, 0.3)';
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fill();
              }
            }

            for (let i = 0; i < particleCount; i++) {
              particles.push(new Particle());
            }

            let animationFrameId: number;
            const animate = () => {
              ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
              particles.forEach((particle) => {
                particle.update();
                particle.draw();
              });
              animationFrameId = requestAnimationFrame(animate);
            };

            animate();

            return () => {
              if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
              }
            };
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
            <img
              src={session?.user?.image || '/default-avatar.png'}
              alt={session?.user?.name || 'User'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-theme-primary shadow-xl flex-shrink-0 mx-auto sm:mx-0"
            />

            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                {session?.user?.name}
              </h1>
              <p className="text-lg text-theme-secondary">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-theme-background border-b border-theme py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
            <div>
              <div className="text-4xl font-bold text-white">{upvotedApps.length}</div>
              <div className="text-sm text-theme-secondary">Upvoted Applications</div>
            </div>
            <div className="h-12 w-px bg-theme"></div>
            <div>
              <div className="text-4xl font-bold text-white">{likedApps.length}</div>
              <div className="text-sm text-theme-secondary">Liked Applications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Upvoted Applications */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              ⭐ Upvoted Applications
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
          </div>

          {upvotedApps.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <p className="text-lg text-gray-400 mb-6">
                You haven't upvoted any applications yet.
              </p>
              <Link
                href="/applications"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Explore Applications
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upvotedApps.map((app) => (
                <Link
                  key={app.uid}
                  href={`/applications/${app.uid}`}
                  className="group bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">⭐</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors duration-300 truncate">
                        {app.title || app.uid}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Liked Applications */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              ❤️ Liked Applications
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full" />
          </div>

          {likedApps.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <p className="text-lg text-gray-400 mb-6">
                You haven't liked any applications yet.
              </p>
              <Link
                href="/applications"
                className="inline-block px-8 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Browse Applications
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {likedApps.map((app) => (
                <Link
                  key={app.uid}
                  href={`/applications/${app.uid}`}
                  className="group bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">❤️</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold group-hover:text-pink-300 transition-colors duration-300 truncate">
                        {app.title || app.uid}
                      </h3>
                    </div>
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
