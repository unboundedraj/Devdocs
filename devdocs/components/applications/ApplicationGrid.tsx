import { Application } from '@/types/application';
import ApplicationCard from './ApplicationCard';

interface ApplicationGridProps {
  applications: Application[];
}

export default function ApplicationGrid({ applications }: ApplicationGridProps) {
  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Be the first to contribute documentation! Share your favorite tools and help the community.
        </p>
        
          href="/support"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        <a>
          Learn How to Contribute
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{applications.length}</span> applications
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <ApplicationCard key={app.uid} application={app} />
        ))}
      </div>
    </div>
  );
}