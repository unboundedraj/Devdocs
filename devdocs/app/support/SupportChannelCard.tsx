"use client";

import { SupportChannel } from '@/types/supportpage';

interface SupportChannelCardProps {
  channel: SupportChannel;
}

export default function SupportChannelCard({ channel }: SupportChannelCardProps) {
  return (
    <a
      href={channel.uri_for_support}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {channel.platform_name}
        </h3>
        <svg 
          className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
          />
        </svg>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {channel.platform_description}
      </p>
      
      <div className="text-indigo-600 text-sm font-medium">
        Get Support →
      </div>
    </a>
  );
}