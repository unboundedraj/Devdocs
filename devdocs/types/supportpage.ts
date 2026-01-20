export interface SupportChannel {
  platform_name: string;
  platform_description: string;
  uri_for_support: string;
}

export interface Supportpage {
  uid: string;
  title: string;
  multi_line_textbox?: string;
  support_channels?: SupportChannel[];
  contribution_guidelines?: string;
  created_at?: string;
  updated_at?: string;
}