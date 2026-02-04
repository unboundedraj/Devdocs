'use client';

import { useEffect } from 'react';
import ContentstackLivePreview from '@contentstack/live-preview-utils';
import Stack from '@/lib/contentstack';

export default function LivePreviewProvider() {
  useEffect(() => {
    // Initialize live preview globally for all pages
    ContentstackLivePreview.init({
      enable: true,
      ssr: false,
      stackSdk: Stack,
      editButton: {
        enable: true,
      },
      stackDetails: {
        apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
      },
      clientUrlParams: {
        protocol: 'https',
        host: process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST || 'app.contentstack.com',
        port: 443,
      },
    });
  }, []);

  return null;
}
