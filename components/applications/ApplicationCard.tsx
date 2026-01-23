import { useState } from 'react';
import Link from 'next/link';
import { Application } from '@/types/application';
import { signIn, useSession } from 'next-auth/react';

interface ApplicationCardProps {
  application: Application;
  isUpvoted?: boolean;
  onUpvoteSuccess?: () => void;
}
export default function ApplicationCard({ application, isUpvoted: initialIsUpvoted = false, onUpvoteSuccess }: ApplicationCardProps) {
  const { data: session, status } = useSession();
  const [upvotes, setUpvotes] = useState(application.upvotes || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(initialIsUpvoted);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault(); // ⛔ stop Link navigation
    e.stopPropagation();

    if (status === 'loading') return;

    // Enforce "logged-in users only" at the UI layer
    if (!session?.user) {
      await signIn('google');
      return;
    }

    // Prevent repeat clicks in the UI (API is still the source of truth)
    if (isUpvoting || hasUpvoted) return;

    setIsUpvoting(true);
    try {
      const res = await fetch('/api/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationUid: application.uid }),
      });

      // Session expired or not present on server
      if (res.status === 401) {
        await signIn('google');
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error('Upvote failed:', data);
        return;
      }

      // Server returns canonical count (even if already upvoted)
      if (typeof data?.upvotes === 'number') {
        setUpvotes(data.upvotes);
      }

      if (data?.success && !data?.alreadyUpvoted) {
        setHasUpvoted(true);
        // Notify parent to update upvoted list
        onUpvoteSuccess?.();
      } else if (data?.alreadyUpvoted) {
        setHasUpvoted(true);
      }
    } finally {
      setIsUpvoting(false);
    }
  };
  return (
    <Link 
      href={`/applications/${application.uid}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-indigo-300 overflow-hidden h-full flex flex-col"
    >
      {/* Card Header with Category Badge */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {application.app_category && (
            <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
              {application.app_category}
            </span>
          )}
          {application.application_status === 'Active' && (
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              ✓ Active
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
          {application.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {application.app_description || application.main_description?.replace(/<[^>]*>/g, '').substring(0, 150) || 'View comprehensive documentation and guides for ' + application.title}
        </p>

        {/* Tags */}
        {application.tags && application.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {application.tags.slice(0, 3).map((tag: string, index: number) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {application.tags.length > 3 && (
              <span className="text-gray-400 text-xs self-center">
                +{application.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
  <span className="text-sm text-gray-500">
    {application.maintainer_name || 'Community'}
  </span>

  <div className="flex items-center gap-4">
    {/* Upvote */}
    <button
      onClick={handleUpvote}
      disabled={status === 'loading' || isUpvoting || hasUpvoted}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium transition-all ${
        hasUpvoted
          ? 'bg-indigo-50 text-indigo-600 cursor-default'
          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
      } ${isUpvoting ? 'opacity-50 cursor-wait' : ''}`}
      title={hasUpvoted ? 'You already upvoted this' : 'Upvote this application'}
    >
      <span className={`text-lg ${hasUpvoted ? 'filter drop-shadow-sm' : ''}`}>
        {hasUpvoted ? '👍' : '⬆️'}
      </span>
      <span className={hasUpvoted ? 'font-semibold' : ''}>{upvotes}</span>
      {hasUpvoted && (
        <span className="ml-0.5 text-xs text-indigo-500 font-bold">✓</span>
      )}
    </button>

    {/* View Docs (unchanged) */}
    <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
      View Docs
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7" />
      </svg>
    </div>
  </div>
</div>

        
      </div>
    </Link>
  );
}