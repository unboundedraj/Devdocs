import { getAllApplications } from '@/lib/queries';
import ApplicationGrid from '@/app/applications/ApplicationGrid';

export default async function ApplicationsPage() {
  const applications = await getAllApplications();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Applications
          </h1>
          <p className="text-xl text-gray-600">
            Browse documentation for all available applications
          </p>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <ApplicationGrid applications={applications} />
        </div>
      </section>
    </main>
  );
}