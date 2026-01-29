import { getAllApplications } from '@/lib/queries';
import { setLivePreviewQueryParams } from '@/lib/utils';
import ApplicationsContent from '@/components/applications/ApplicationsContent';

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  setLivePreviewQueryParams(params);
  
  const applications = await getAllApplications();

  return (
    <main className="min-h-screen bg-gray-50">
      <ApplicationsContent applications={applications} />
    </main>
  );
}