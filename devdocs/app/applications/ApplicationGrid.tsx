import { Application } from '@/types/application';
import ApplicationCard from './ApplicationCard';

interface ApplicationGridProps {
  applications: Application[];
}

export default function ApplicationGrid({ applications }: ApplicationGridProps) {
  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No applications found.</p>
        <p className="text-gray-500 mt-2">Be the first to contribute documentation!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app) => (
        <ApplicationCard key={app.uid} application={app} />
      ))}
    </div>
  );
}