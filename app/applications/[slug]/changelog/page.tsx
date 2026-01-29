import { getAllApplications, getChangelogsByApplicationUid } from '@/lib/queries';
import { setLivePreviewQueryParams } from '@/lib/utils';
import Link from 'next/link';
import ChangelogList from '@/components/changelog/ChangelogList';

export default async function ChangelogPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const urlParams = await searchParams;
  setLivePreviewQueryParams(urlParams);
  
  // Get the application
  const applications = await getAllApplications();
  const application = applications.find(app => app.uid === slug);

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Application Not Found</h1>
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

  // Get changelogs for this application
  const changelogs = await getChangelogsByApplicationUid(slug);

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
            <Link href={`/applications/${slug}`} className="hover:text-indigo-600">
              {application.title}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Changelog</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <section className="bg-white py-12 px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {application.title} Changelog
              </h1>
              <p className="text-gray-600">
                Track all updates, improvements, and bug fixes
              </p>
            </div>
            <Link
              href={`/applications/${slug}`}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Changelog List */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <ChangelogList changelogs={changelogs} />
        </div>
      </section>
    </main>
  );
}