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
