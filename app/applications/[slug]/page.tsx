import { getAllApplications } from '@/lib/queries';
import { setLivePreviewQueryParams } from '@/lib/utils';
import Link from 'next/link';

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const urlParams = await searchParams;
  setLivePreviewQueryParams(urlParams);
  
  const applications = await getAllApplications();
  const application = applications.find(app => app.uid === slug);

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist.</p>
          <Link 
            href="/applications"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/applications" className="hover:text-indigo-600">Applications</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{application.title}</span>
          </nav>
        </div>
      </div>

      {/* Application Header */}
      <section className="bg-white py-12 px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {application.title}
              </h1>
              <p className="text-gray-600">
                by {application.maintainer_name || 'Unknown'}
              </p>
            </div>
            
            <div className="flex gap-2">
              {application.app_category && (
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
                  {application.app_category}
                </span>
              )}
              {application.application_status && (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                  {application.application_status}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {application.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          


          {/* Quick Actions */}
          <div className="flex gap-4">
            {application.url && (
              <a 
                href={application.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                Visit Website
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <Link
              href={`/applications/${slug}/changelog`}
              className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              View Changelogs
            </Link>
          </div>
        </div>
      </section>

      {/* Main Description */}
   {application.main_description && (
  <section className="py-12 px-6">
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About {application.title}</h2>
      <div 
        className="rich-text text-gray-700"
        dangerouslySetInnerHTML={{ __html: application.main_description }}
      />
    </div>
  </section>
)}


      {/* Key Features */}
      {application.app_key_features && application.app_key_features.length > 0 && (
        <section className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {application.app_key_features.map((feature: any, index: number) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.app_key_feature_title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.app_key_features_description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Getting Started */}
   {application.getting_started && (
  <section className="py-12 px-6">
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
      <div 
        className="rich-text text-gray-700"
        dangerouslySetInnerHTML={{ __html: application.getting_started }}
      />
    </div>
  </section>
)}

      {/* App Description (if different from main) */}
      {application.app_description && (
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Overview</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {application.app_description}
            </p>
          </div>
        </section>
      )}

      
    </main>
  );
}