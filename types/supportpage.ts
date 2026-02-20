export interface SupportChannel {
  platfrom_name: string;
  platform_description: string;
  url_for_support: {
    title: string;
    href: string;
  };
}

export interface Supportpage {
  uid: string;
  title: string;
  multi_line?: string;
  support_channels?: SupportChannel[];
  contribution_guidelines?: string;
  created_at?: string;
  updated_at?: string;
}