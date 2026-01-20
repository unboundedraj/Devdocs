import { getSupportPage } from '@/lib/queries';
import SupportChannels from '@/app/support/SupportChannels';

export default async function SupportPage() {
  const supportPage = await getSupportPage();

  if (!supportPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load support page content</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {supportPage.title}
          </h1>
          {supportPage.multi_line_textbox && (
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {supportPage.multi_line_textbox}
            </p>
          )}
        </div>
      </section>

      {/* Support Channels */}
      {supportPage.support_channels && supportPage.support_channels.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              How Can We Help?
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Choose the platform that works best for you
            </p>
            <SupportChannels channels={supportPage.support_channels} />
          </div>
        </section>
      )}

{/* Contribution Guidelines */}
{supportPage.contribution_guidelines && (
  <section className="py-16 px-6 bg-white">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Contribution Guidelines
      </h2>
      <div 
        className="rich-text text-gray-700"
        dangerouslySetInnerHTML={{ __html: supportPage.contribution_guidelines }}
      />
    </div>
  </section>
)}

      {/* Additional Help Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Still Need Help?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find what you're looking for? Our community is here to help you get the most out of DevDocs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/applications"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse Documentation
            </a>
            <a
              href="mailto:support@devdocs.com"
              className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}