import { NextRequest, NextResponse } from 'next/server';
import contentstack from '@contentstack/management';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields based on your schema
    const { 
      title, 
      url, 
      app_description, 
      main_description,
      application_status,
      app_category, 
      app_tags,
      maintainer_name,
      app_key_features,
      getting_started,
      app_useful_links
    } = body;
    
    if (!title || !url || !app_description || !main_description || !application_status) {
      return NextResponse.json(
        { error: 'Title, URL, App Description, Main Description, and Application Status are required' },
        { status: 400 }
      );
    }

    // Initialize Management SDK
    const client = contentstack.client({
      authtoken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!
    });

    const stack = client.stack({
      api_key: process.env.CONTENTSTACK_API_KEY!
    });

    // Prepare entry data matching your schema
    const entryData: any = {
      title,
      url,
      app_description,
      main_description,
      application_status,
    };

    // Optional fields
    if (app_category) entryData.app_category = app_category;
    if (app_tags && app_tags.length > 0) entryData.app_tags = app_tags;
    if (maintainer_name) entryData.maintainer_name = maintainer_name;
    if (getting_started) entryData.getting_started = getting_started;
    
    // Handle app_key_features (group field)
    if (app_key_features && app_key_features.length > 0) {
      entryData.app_key_features = app_key_features;
    }

    // Handle app_useful_links (group field)
    if (app_useful_links && app_useful_links.length > 0) {
      entryData.app_useful_links = app_useful_links;
    }

    // Create entry in Application content type
    const entry = await stack
      .contentType('application')
      .entry()
      .create({
        entry: entryData
      });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! It will be reviewed by our team.',
      entry_uid: entry.uid
    });

  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}