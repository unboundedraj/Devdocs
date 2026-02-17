import * as ContentstackManagement from '@contentstack/management';

// Validate required environment variables
if (!process.env.CONTENTSTACK_MANAGEMENT_TOKEN) {
  console.error('Missing CONTENTSTACK_MANAGEMENT_TOKEN in environment variables');
} else {
  console.log('✓ CONTENTSTACK_MANAGEMENT_TOKEN loaded:', process.env.CONTENTSTACK_MANAGEMENT_TOKEN.substring(0, 10) + '...');
}

if (!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY) {
  console.error('Missing NEXT_PUBLIC_CONTENTSTACK_API_KEY in environment variables');
} else {
  console.log('✓ NEXT_PUBLIC_CONTENTSTACK_API_KEY loaded:', process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY);
}

// Initialize the Contentstack Management SDK client
const managementClient = ContentstackManagement.client({
  authtoken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
  host: process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io',
  // Explicitly set headers for authentication
  headers: {
    api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  },
});

// Get the stack instance with management token
const Stack = managementClient.stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
});

console.log('✓ Contentstack Management client initialized');

export default Stack;