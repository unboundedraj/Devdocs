import Link from 'next/link';
import { Application } from '@/types/application';

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link 
      href={`/applications/${application.uid}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 h-full flex flex-col group"
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
        {application.title}
      </h3>

      {/* URL */}
      {application.url && (
        <p className="text-sm text-gray-500 mb-4 truncate">
          🔗 {application.url}
        </p>
      )}

      {/* Description placeholder */}
      <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-4">
        View comprehensive documentation and guides for {application.title}
      </p>

      {/* View Documentation Link */}
      <div className="flex items-center text-indigo-600 font-medium text-sm">
        <span>View Documentation</span>
        <svg 
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </Link>
  );
}