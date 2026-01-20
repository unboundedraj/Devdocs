import { Application } from '@/types/application';
export interface ValueProposition {
  proposition_title: string;
  proposition_description: string;
}

export interface ContributionCTA {
  cta_heading: string;
  cta_description: string;
  cta_url: string;
}

export interface Metadata {
  seo_title: string;
  seo_description: string;
}

export interface Homepage {
  uid: string;
  title: string;
  hero_description: string;
  value_propositions: ValueProposition[];
featured_applications: Application[];
  contribution_cta: ContributionCTA;
  metadata: Metadata;
}