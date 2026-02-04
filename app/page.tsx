'use client';

import { useEffect, useState } from 'react';
import { getHomepageByQuery } from '@/lib/queries';
import HeroSection from '@/components/homepage/HeroSection';
import ValuePropositions from '@/components/homepage/ValuePropositions';
import FeaturedApplications from '@/components/homepage/FeaturedApplications';
import ContributionCTA from '@/components/homepage/ContributionCTA';
import ContentstackLivePreview from '@contentstack/live-preview-utils';
import Stack from '@/lib/contentstack';

export default function HomePage() {
  const [homepage, setHomepage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize live preview
    ContentstackLivePreview.init({
      enable: true,
      ssr: false,
      stackSdk: Stack,
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

    // Fetch homepage data
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getHomepageByQuery();
        setHomepage(data);
      } catch (err) {
        console.error('Error fetching homepage:', err);
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchData();

    // Listen for live preview changes and refetch
    const unsubscribe = ContentstackLivePreview.onEntryChange(() => {
      console.log('Homepage entry changed in live preview - refetching...');
      fetchData();
    });

    // Cleanup
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-semibold">Loading homepage...</p>
        </div>
      </div>
    );
  }

  if (!homepage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Failed to load homepage content</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <HeroSection 
        title={homepage.title}
        description={homepage.hero_description}
        entry_uid={homepage.uid}
      />

      <ValuePropositions 
        propositions={homepage.value_propositions}
        entry_uid={homepage.uid}
      />

      <ContributionCTA
        heading={homepage.contribution_cta?.cta_heading}
        description={homepage.contribution_cta?.cta_description}
        url={homepage.contribution_cta?.cta_url}
      />

      <FeaturedApplications applications={homepage.featured_applications} />
    </main>
  );
}

