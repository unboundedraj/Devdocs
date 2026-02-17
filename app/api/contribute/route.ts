import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createApplication } from '@/lib/contentstack-management-queries';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      title,
      url,
      app_description,
      main_description,
      application_status,
      app_category,
      app_tags,
      maintainer_name,
      getting_started,
      app_key_features,
      app_useful_links,
    } = body;

    if (!title || !url || !app_description || !main_description || !application_status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const entry = await createApplication({
      title,
      url,
      app_description,
      main_description,
      application_status,
      app_category: app_category || undefined,
      app_tags: app_tags?.length ? app_tags : undefined,
      maintainer_name: maintainer_name || undefined,
      getting_started: getting_started || undefined,
      app_key_features: app_key_features?.length ? app_key_features : undefined,
      app_useful_links: app_useful_links?.length ? app_useful_links : undefined,
      contributed_by: session.user.email,
      contribution_status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message:
        'Application submitted successfully! It will be reviewed by an admin before publishing.',
      entryUid: entry.uid,
    });
  } catch (error) {
    console.error('Contribute failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
