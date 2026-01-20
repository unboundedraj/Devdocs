export interface Changelog {
  uid: string;
  changelog_title: string;
  application_reference?: any; // Reference to Application
  changelog_version?: string;
  release_date?: string;
  change_type?: string;
  changelog_summary?: string;
  detailed_changes?: string;
  breaking_change?: boolean;
  released_by?: string;
  created_at?: string;
  updated_at?: string;
}