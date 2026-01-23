import { Changelog } from '@/types/changelog';

interface ChangelogItemProps {
  changelog: Changelog;
}

export default function ChangelogItem({ changelog }: ChangelogItemProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getChangeTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'feature':
        return 'bg-green-100 text-green-700';
      case 'bugfix':
      case 'bug fix':
        return 'bg-blue-100 text-blue-700';
      case 'breaking':
      case 'breaking change':
        return 'bg-red-100 text-red-700';
      case 'improvement':
        return 'bg-purple-100 text-purple-700';
      case 'security':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {changelog.changelog_title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {changelog.changelog_version && (
              <span className="font-semibold">
                v{changelog.changelog_version}
              </span>
            )}
            <span>•</span>
            <span>{formatDate(changelog.release_date)}</span>
            {changelog.released_by && (
              <>
                <span>•</span>
                <span>by {changelog.released_by}</span>
              </>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-2 items-end">
          {changelog.change_type && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getChangeTypeColor(changelog.change_type)}`}>
              {changelog.change_type}
            </span>
          )}
          {changelog.breaking_change && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
              ⚠️ Breaking Change
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {changelog.changelog_summary && (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {changelog.changelog_summary}
          </p>
        </div>
      )}

      {/* Detailed Changes */}
      {changelog.detailed_changes && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Detailed Changes
          </h4>
          <div
            className="rich-text text-gray-700"
            dangerouslySetInnerHTML={{ __html: changelog.detailed_changes }}
          />
        </div>
      )}
    </div>
  );
}
