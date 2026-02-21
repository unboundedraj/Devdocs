'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContentstackLivePreview from '@contentstack/live-preview-utils';

export default function LivePreviewProvider() {
  const router = useRouter();

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
        enable: false,
        exclude: ['outsideLivePreviewPortal'],
        includeByQueryParameter: false,
        position: 'top-right',
      },
      debug: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT !== 'production',
    });

    // Auto-refresh page when content changes in Contentstack Live Preview
    ContentstackLivePreview.onEntryChange(() => {
      router.refresh();
    });
  }, [router]);

  return null;
}
