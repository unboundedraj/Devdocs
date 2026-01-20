export interface AppKeyFeature {
  app_key_feature_title: string;
  app_key_features_description: string;
  _metadata?: {
    uid: string;
  };
}

export interface Application {
  uid: string;
  title: string;
  url: string;
  _version?: number;
  locale?: string;
  
  // Main content
  main_description?: string;
  app_description?: string;
  getting_started?: string;
  
  // Features
  app_key_features?: AppKeyFeature[];
  
  // Metadata
  app_category?: string;
  application_status?: string;
  maintainer_name?: string;
  tags?: string[];
  app_tags?: string[];
  
  // Useful links
  app_useful_links?: any[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  
  // Publishing
  publish_details?: {
    time: string;
    user: string;
    environment: string;
    locale: string;
  };
}