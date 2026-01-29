import contentstack from 'contentstack';

const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  live_preview: { 
        preview_token: process.env.PREVIEW_TOKEN!, 
        enable: true, 
        host: 'rest-preview.contentstack.com' 
    }, 

});

export default Stack;
