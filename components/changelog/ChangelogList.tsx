import { Changelog } from '@/types/changelog';
import ChangelogItem from './ChangelogItem';

interface ChangelogListProps {
  changelogs: Changelog[];
}

export default function ChangelogList({ changelogs }: ChangelogListProps) {
  if (!changelogs || changelogs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 text-lg mb-2">No changelog entries yet.</p>
        <p className="text-gray-500 text-sm">
          Check back later for updates and release notes.
        </p>
      </div>
    );
  }

  // Group changelogs by year
  const groupedByYear = changelogs.reduce((acc: any, changelog) => {
    const year = new Date(changelog.release_date || changelog.created_at || '').getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(changelog);
    return acc;
  }, {});

  const years = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-indigo-300 to-transparent"></div>

      <div className="space-y-12">
        {years.map(year => (
          <div key={year} className="relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 sticky top-20 bg-white py-2 z-10 pl-20">
              {year}
            </h2>
            <div className="space-y-6">
              {groupedByYear[year].map((changelog: Changelog) => (
                <div key={changelog.uid} className="relative pl-20">
                  <div className="absolute left-0 top-4 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-md"></div>

                  <ChangelogItem changelog={changelog} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
