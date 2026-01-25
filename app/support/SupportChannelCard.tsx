"use client";

import { SupportChannel } from '@/types/supportpage';

interface SupportChannelCardProps {
  channel: SupportChannel;
}

export default function SupportChannelCard({ channel }: SupportChannelCardProps) {
  return (
    <a
      href="https://github.com/unboundedraj/Devdocs"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200 group hover:border-indigo-300 overflow-hidden relative"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {channel.platform_name}
          </h3>
          <svg 
            className="w-6 h-6 text-indigo-600 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform flex-shrink-0" 
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
        
        <p className="text-gray-600 text-base leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
          {channel.platform_description}
        </p>
        
        <div className="inline-flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
          <span>Get Support</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </a>
  );
}