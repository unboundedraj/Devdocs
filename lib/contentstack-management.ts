import * as ContentstackManagement from '@contentstack/management';

// Validate required environment variables
if (!process.env.CONTENTSTACK_MANAGEMENT_TOKEN) {
  console.error('Missing CONTENTSTACK_MANAGEMENT_TOKEN in environment variables');
}
if (!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY) {
  console.error('Missing NEXT_PUBLIC_CONTENTSTACK_API_KEY in environment variables');
}

// Initialize the Contentstack Management SDK client.
// IMPORTANT: Do NOT pass `authtoken` here — that is for personal login tokens.
// Stack-level management tokens are passed via `.stack({ management_token })`.
const managementClient = ContentstackManagement.client({
  host: process.env.CONTENTSTACK_API_HOST || 'api.contentstack.io',
});

// Get the stack instance — management_token authenticates all requests on this stack.
const Stack = managementClient.stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
});

export default Stack;