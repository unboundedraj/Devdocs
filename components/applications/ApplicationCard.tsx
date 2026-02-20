import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Application } from '@/types/application';
import { signIn, useSession } from 'next-auth/react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { getEditTags } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
  isUpvoted?: boolean;
  onUpvoteSuccess?: () => void;
  isLiked?: boolean;
  onLikeSuccess?: () => void;
}

export default function ApplicationCard({ application, isUpvoted: initialIsUpvoted = false, onUpvoteSuccess, isLiked: initialIsLiked = false, onLikeSuccess }: ApplicationCardProps) {
  const { data: session, status } = useSession();
  const [upvotes, setUpvotes] = useState(application.upvotes || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(initialIsUpvoted);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(initialIsLiked);

  useEffect(() => {
    setHasUpvoted(initialIsUpvoted);
  }, [initialIsUpvoted]);

  useEffect(() => {
    setHasLiked(initialIsLiked);
  }, [initialIsLiked]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'loading') return;

    if (!session?.user) {
      await signIn('google');
      return;
    }

    if (isUpvoting || hasUpvoted) return;

    setIsUpvoting(true);
    try {
      const res = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationUid: application.uid }),
      });

      if (res.status === 401) {
        await signIn('google');
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error('Upvote failed:', data);
        return;
      }

      if (typeof data?.upvotes === 'number') {
        setUpvotes(data.upvotes);
      }

      if (data?.success && !data?.alreadyUpvoted) {
        setHasUpvoted(true);
        onUpvoteSuccess?.();
      } else if (data?.alreadyUpvoted) {
        setHasUpvoted(true);
      }
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'loading' || isLiking || hasLiked) return;

    if (!session?.user) {
      await signIn('google');
      return;
    }

    setIsLiking(true);
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationUid: application.uid }),
      });

      if (res.status === 401) {
        await signIn('google');
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error('Like failed:', data);
        return;
      }

      if (data?.success && !data?.alreadyLiked) {
        setHasLiked(true);
        onLikeSuccess?.();
      } else if (data?.alreadyLiked) {
        setHasLiked(true);
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Link 
      href={`/applications/${application.uid}`}
      className="group relative rounded-2xl overflow-hidden"
    >
      <div className="relative rounded-2xl border border-gray-800 p-2 h-full">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black shadow-2xl hover:shadow-indigo-900/50 transition-all duration-300 border-gray-800 hover:border-indigo-500 backdrop-blur-sm p-6 min-h-full">
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          {/* Card Header with Category Badge */}
          <div className="flex items-center justify-between mb-2 relative z-10">
            {application.app_category && (
              <span className="inline-block bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-700" {...getEditTags(application, 'app_category')}>
                {application.app_category}
              </span>
            )}
            {application.application_status === 'Active' && (
              <span className="inline-block bg-green-900 text-green-300 px-3 py-1 rounded-lg text-xs font-semibold border border-green-800">
                ✓ Active
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="flex-1 flex flex-col relative z-10">
            {/* Title */}
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent mb-3 group-hover:text-indigo-400 transition-all line-clamp-2" {...getEditTags(application, 'title')}>
              {application.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3 group-hover:text-gray-300 transition-colors" {...getEditTags(application, 'app_description')}>
              {application.app_description || application.main_description?.replace(/<[^>]*>/g, '').substring(0, 150) || 'View comprehensive documentation and guides for ' + application.title}
            </p>

            {/* Tags */}
            {application.tags && application.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {application.tags.slice(0, 2).map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs border border-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
                {application.tags.length > 2 && (
                  <span className="text-gray-500 text-xs self-center">
                    +{application.tags.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-between relative z-10">
            <span className="text-xs text-gray-500 truncate">
              {application.maintainer_name || 'Community'}
            </span>

            <div className="flex items-center gap-3">
              {/* Like (only for authenticated users) */}
              {session?.user && (
                <button
                  onClick={handleLike}
                  disabled={isLiking || hasLiked}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all border border-transparent ${
                    hasLiked
                      ? 'bg-gray-800 text-pink-200 border-pink-500/40 cursor-default'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700'
                  } ${isLiking ? 'opacity-50 cursor-wait' : ''}`}
                  title={hasLiked ? 'Added to your likes' : 'Like this application'}
                >
                  <span className="text-sm">{hasLiked ? '❤️' : '🤍'}</span>
                </button>
              )}

              {/* Upvote */}
              <button
                onClick={handleUpvote}
                disabled={status === 'loading' || isUpvoting || hasUpvoted}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  hasUpvoted
                    ? 'bg-gray-800 text-gray-300 cursor-default border border-gray-700'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                } ${isUpvoting ? 'opacity-50 cursor-wait' : ''}`}
                title={hasUpvoted ? 'You already upvoted this' : 'Upvote this application'}
              >
                <span className={`text-sm ${hasUpvoted ? 'filter drop-shadow-sm' : ''}`}>
                  {hasUpvoted ? '👍' : '⬆️'}
                </span>
                <span className="text-xs">{upvotes}</span>
              </button>

              {/* View Docs */}
              <div className="flex items-center text-gray-300 font-semibold text-xs group-hover:text-indigo-400 transition-colors">
                →
              </div>
            </div>
          </div>

          {/* Hover Decoration with blur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        </div>
      </div>
    </Link>
  );
}