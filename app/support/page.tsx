import { getSupportPage } from '@/lib/queries';
import { setLivePreviewQueryParams, getEditTags } from '@/lib/utils';
import SupportChannels from '@/app/support/SupportChannels';
import { HeroParallax } from '@/components/ui/hero-parallax';

const supportResources = [
  {
    title: "Home",
    link: "/",
    thumbnail: "/images/support/home.png",
  },
  {
    title: "Documentation",
    link: "/applications",
    thumbnail: "/images/support/documentation.png",
  },
  {
    title: "FAQ",
    link: "/faqs",
    thumbnail: "/images/support/faq.png",
  },
  {
    title: "AI Chat",
    link: "/chat",
    thumbnail: "/images/support/chat.png",
  },
  {
    title: "Support",
    link: "/support",
    thumbnail: "/images/support/support.png",
  },
  {
    title: "API Reference",
    link: "/applications",
    thumbnail: "/images/support/home.png",
  },
  {
    title: "Guides",
    link: "/applications",
    thumbnail: "/images/support/documentation.png",
  },
  {
    title: "Tutorials",
    link: "/applications",
    thumbnail: "/images/support/faq.png",
  },
  {
    title: "Contribute",
    link: "/contribute",
    thumbnail: "/images/support/chat.png",
  },
  {
    title: "Changelog",
    link: "/applications",
    thumbnail: "/images/support/support.png",
  },
  {
    title: "Roadmap",
    link: "/applications",
    thumbnail: "/images/support/home.png",
  },
  {
    title: "Security",
    link: "/support",
    thumbnail: "/images/support/documentation.png",
  },
  {
    title: "Privacy",
    link: "/support",
    thumbnail: "/images/support/faq.png",
  },
  {
    title: "Community",
    link: "/chat",
    thumbnail: "/images/support/chat.png",
  },
  {
    title: "Feedback",
    link: "/contribute",
    thumbnail: "/images/support/support.png",
  },
];

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  setLivePreviewQueryParams(params);
  
  const supportPage = await getSupportPage();

  if (!supportPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load support page content</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      <HeroParallax products={supportResources} title={supportPage.title} description={supportPage.multi_line} />

      {/* Support Channels */}
      {supportPage.support_channels && supportPage.support_channels.length > 0 && (
        <section className="py-20 bg-black px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-white mb-6">
                Multiple Ways to Connect
              </h2>
              <p className="text-lg text-gray-600">
                Choose your preferred platform to get instant support
              </p>
            </div>
            <SupportChannels channels={supportPage.support_channels} entry={supportPage} />
          </div>
        </section>
      )}

{/* Contribution Guidelines */}
{supportPage.contribution_guidelines && (
  <section className="py-20 px-6 bg-white border-t border-gray-100">
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium mb-4">
          💡 Contributing
        </div>
        <h2 className="text-4xl font-bold text-gray-900">
          Contribution Guidelines
        </h2>
      </div>
      <div className="rich-text text-gray-700"
        dangerouslySetInnerHTML={{ __html: supportPage.contribution_guidelines }}
        {...getEditTags(supportPage, 'contribution_guidelines')}
      />
    </div>
  </section>
)}

      {/* Additional Help Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Still Need Help?
          </h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Can't find what you're looking for? Our community is here to help you get the most out of DevDocs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/applications"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-200 hover:shadow-lg"
            >
              Browse Documentation
            </a>
            <a
              href="/chat"
              className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-all duration-200 border-2 border-white/30 hover:border-white"
            >
              💬 Try AI Chat
            </a>
            <a
              href="mailto:support@devdocs.com"
              className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-white/10 transition-all duration-200"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}