'use client';

import { useEffect } from 'react';
import ContentstackLivePreview from '@contentstack/live-preview-utils';

export default function LivePreviewProvider() {
  useEffect(() => {
    ContentstackLivePreview.init({
      enable: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT !== 'production',
      cleanCslpOnProduction: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT === 'production',
      ssr: true,
      stackDetails: {
        apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
      },
      clientUrlParams: {
        host: 'app.contentstack.com', // AWS NA region
      },
      editButton: {
        enable: true,
        exclude: ['outsideLivePreviewPortal'],
        includeByQueryParameter: true,
        position: 'top-right',
      },
      debug: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT !== 'production',
    });
  }, []);

  return null;
}
