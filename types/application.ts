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
  upvotes?: number;
  url: string;
  _version?: number;
  locale?: string;

  main_description?: string;
  app_description?: string;
  getting_started?: string;
  
  app_key_features?: AppKeyFeature[];
  
  app_category?: string;
  application_status?: string;
  maintainer_name?: string;
  tags?: string[];
  app_tags?: string[];
  
  app_useful_links?: any[];
  
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  
  publish_details?: {
    time: string;
    user: string;
    environment: string;
    locale: string;
  };


}