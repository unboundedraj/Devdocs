# Contentstack Live Preview Setup

This document explains the live preview implementation for the DevDocs application using Contentstack's Live Preview functionality.

## Overview

Live Preview allows you to see content changes in real-time as you edit entries in the Contentstack CMS, without needing to publish or refresh the page manually.

## Implementation Components

### 1. Contentstack Stack Configuration

The Stack is configured in [lib/contentstack.ts](lib/contentstack.ts) with live preview settings:

```typescript
const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  live_preview: { 
    preview_token: process.env.PREVIEW_TOKEN!, 
    enable: true, 
    host: 'rest-preview.contentstack.com' // AWS NA region
  }, 
});
```

### 2. Live Preview Provider Component

Created [components/LivePreviewProvider.tsx](components/LivePreviewProvider.tsx) - a client-side component that initializes the Contentstack Live Preview Utils SDK.

Key features:
- **Automatic initialization** on component mount
- **Environment-aware** - only enables in non-production environments
- **Edit button support** - displays edit buttons in the Live Preview portal
- **Debug mode** - enabled in development for troubleshooting
- **SSR mode** - configured for Next.js server-side rendering

Configuration:
```typescript
ContentstackLivePreview.init({
  enable: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT !== 'production',
  cleanCslpOnProduction: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT === 'production',
  ssr: true,
  stackDetails: {
    apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  },
  clientUrlParams: {
    host: 'app.contentstack.com', // AWS NA region
  },
  editButton: {
    enable: true,
    exclude: ['outsideLivePreviewPortal'],
    position: 'top-right',
  },
});
```

### 3. Utility Function for Query Parameters

Added `setLivePreviewQueryParams` function in [lib/utils.ts](lib/utils.ts) to handle live preview query parameters:

```typescript
export function setLivePreviewQueryParams(queryParams: Record<string, any>) {
  if (queryParams?.live_preview) {
    Stack.livePreviewQuery(queryParams as any);
  }
}
```

This function:
- Checks if the request contains live preview parameters
- Injects the live preview hash and ContentType UID into the Stack instance
- Enables the delivery SDK to fetch preview content

### 4. Root Layout Integration

The `LivePreviewProvider` is included in [app/layout.tsx](app/layout.tsx) to initialize live preview globally:

```typescript
<SessionProvider>
  <LivePreviewProvider />
  <Header />
  {children}
  <Footer />
</SessionProvider>
```

### 5. Page-Level Integration

All pages that fetch content from Contentstack have been updated to accept and process search parameters:

**Updated Pages:**
- [app/page.tsx](app/page.tsx) - Homepage
- [app/applications/page.tsx](app/applications/page.tsx) - Applications listing
- [app/applications/[slug]/page.tsx](app/applications/[slug]/page.tsx) - Application details
- [app/applications/[slug]/changelog/page.tsx](app/applications/[slug]/changelog/page.tsx) - Changelog
- [app/faqs/page.tsx](app/faqs/page.tsx) - FAQs
- [app/support/page.tsx](app/support/page.tsx) - Support page

Example implementation:
```typescript
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  setLivePreviewQueryParams(params);
  
  const homepage = await getHomepageByQuery();
  // ... rest of the component
}
```

## Environment Variables

Ensure these environment variables are set in your `.env.local`:

```env
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development
PREVIEW_TOKEN=your_preview_token
```

## Dependencies

The following npm packages are required (already installed):

```json
{
  "contentstack": "^3.26.3",
  "@contentstack/live-preview-utils": "^4.2.1"
}
```

## How to Use Live Preview

1. **Access Contentstack CMS**: Log in to your Contentstack account
2. **Open an Entry**: Navigate to any content entry (e.g., homepage, application)
3. **Click Live Preview**: Click the "Live Preview" button in the entry editor
4. **Configure Preview URL**: Ensure the preview URL is set to your local development server (e.g., `http://localhost:3000`)
5. **Edit Content**: Make changes to the entry content
6. **See Real-time Updates**: Changes will appear instantly in the preview panel
7. **Edit Buttons**: In the preview, you'll see edit buttons on editable content that take you back to the CMS

## Testing Live Preview Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your application at `http://localhost:3000`

3. In Contentstack, open any entry and click "Live Preview"

4. The preview should load your local application

5. Make changes to the entry content and watch them update in real-time

## Region-Specific Configuration

If your Contentstack stack is in a different region, update the configuration:

### In [lib/contentstack.ts](lib/contentstack.ts):
```typescript
host: 'eu-rest-preview.contentstack.com' // For EU region
// or
host: 'azure-na-rest-preview.contentstack.com' // For Azure NA
```

### In [components/LivePreviewProvider.tsx](components/LivePreviewProvider.tsx):
```typescript
clientUrlParams: {
  host: 'eu-app.contentstack.com', // For EU region
}
```

**Available regions:**
- **AWS NA**: `rest-preview.contentstack.com` / `app.contentstack.com`
- **AWS EU**: `eu-rest-preview.contentstack.com` / `eu-app.contentstack.com`
- **Azure NA**: `azure-na-rest-preview.contentstack.com` / `azure-na-app.contentstack.com`
- **Azure EU**: `azure-eu-rest-preview.contentstack.com` / `azure-eu-app.contentstack.com`
- **GCP NA**: `gcp-na-rest-preview.contentstack.com` / `gcp-na-app.contentstack.com`

## Troubleshooting

### Live Preview not loading
- Verify all environment variables are correctly set
- Check that the preview token is valid
- Ensure the development server is running
- Check browser console for errors

### Changes not reflecting
- Make sure `ssr: true` is set in LivePreviewProvider
- Verify that pages are calling `setLivePreviewQueryParams`
- Check that the Stack instance is properly configured

### Edit buttons not appearing
- Ensure you're accessing the site through the Contentstack Live Preview panel
- Check `editButton.enable` is set to `true`
- Verify `editButton.exclude` settings

### Debug mode
To see detailed logs, the debug mode is enabled in development:
```typescript
debug: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT !== 'production'
```

Check the browser console for live preview logs and events.

## Production Considerations

In production:
- Live preview is automatically disabled
- Data-CSLP attributes are cleaned from the HTML
- Edit buttons are hidden
- Debug logging is turned off

This is controlled by the environment variable:
```typescript
enable: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT !== 'production'
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Layout (app/layout.tsx)                               │  │
│  │  └─ LivePreviewProvider (Client Component)            │  │
│  │      └─ Initializes ContentstackLivePreview.init()    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Pages (Server Components)                             │  │
│  │  ├─ Accept searchParams                               │  │
│  │  ├─ Call setLivePreviewQueryParams(params)            │  │
│  │  └─ Fetch content via Stack queries                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Utilities (lib/utils.ts)                              │  │
│  │  └─ setLivePreviewQueryParams()                       │  │
│  │      └─ Stack.livePreviewQuery(params)                │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Contentstack SDK (lib/contentstack.ts)                │  │
│  │  └─ Stack initialized with live_preview config        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    Live Preview Utils SDK
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Contentstack Live Preview Panel                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ CMS Entry Editor ← → Preview Frame                    │  │
│  │  • Real-time content updates                          │  │
│  │  • Edit buttons on content                            │  │
│  │  • Live hash in query params                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Additional Resources

- [Contentstack Live Preview Documentation](https://www.contentstack.com/docs/developers/set-up-live-preview)
- [Live Preview Utils SDK](https://github.com/contentstack/live-preview-utils)
- [Next.js Documentation](https://nextjs.org/docs)
