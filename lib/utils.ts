import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Stack from './contentstack';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Set live preview query parameters for Contentstack
 * This enables live preview functionality by injecting live_preview hash and ContentType UID
 */
export function setLivePreviewQueryParams(queryParams: Record<string, any>) {
  if (queryParams?.live_preview) {
    Stack.livePreviewQuery(queryParams as any);
  }
}

/**
 * Get data-cslp attribute for Contentstack Live Preview edit tags
 * This enables inline editing and edit buttons on specific content fields
 * 
 * @param entry - The entry object from Contentstack (should have $._metadata)
 * @param fieldPath - The field path (e.g., 'title', 'description', 'hero.heading')
 * @returns Object with data-cslp attribute or empty object
 */
export function getEditTags(entry: any, fieldPath: string): Record<string, string> {
  if (!entry?.$?._metadata) return {} as Record<string, string>;
  
  const { content_type_uid, uid } = entry.$._metadata;
  return {
    'data-cslp': `${content_type_uid}.${uid}.${fieldPath}`
  };
}
