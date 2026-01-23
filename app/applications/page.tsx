import { getAllApplications } from '@/lib/queries';
import ApplicationsContent from '@/components/applications/ApplicationsContent';

export default async function ApplicationsPage() {
  const applications = await getAllApplications();

  return (
    <main className="min-h-screen bg-gray-50">
      <ApplicationsContent applications={applications} />
    </main>
  );
}