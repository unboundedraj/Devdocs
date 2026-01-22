import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE = 'https://api.contentstack.io/v3';

async function publishApplicationEntry(params: {
  applicationUid: string;
  locale?: string;
}) {
  const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT;
  const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
  const authToken = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;

  if (!environment || !apiKey || !authToken) {
    throw new Error('Missing Contentstack env/api key/management token for publishing');
  }

  // Publishing is required for Delivery API (what the apps page uses) to reflect updated fields.
  const publishRes = await fetch(
    `${API_BASE}/content_types/application/entries/${params.applicationUid}/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        api_key: apiKey,
        authorization: authToken,
      },
      body: JSON.stringify({
        entry: {
          environments: [environment],
          locales: [params.locale || 'en-us'],
        },
      }),
    }
  );

  if (!publishRes.ok) {
    const details = await publishRes.text();
    throw new Error(`Failed to publish application entry: ${details}`);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { applicationUid } = await req.json();

  if (!applicationUid) {
    return NextResponse.json(
      { error: 'Missing application UID' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Fetch user entry
    const userRes = await fetch(
      `${API_BASE}/content_types/users/entries?query=${encodeURIComponent(
        JSON.stringify({ email: session.user.email })
      )}`,
      {
        headers: {
          api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
        },
      }
    );

    if (!userRes.ok) {
      const details = await userRes.text();
      console.error('Failed to fetch user entry:', details);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 502 }
      );
    }

    const userJson = await userRes.json();
    const user = userJson.entries?.[0];

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const upvotedApps = user.upvoted_applications || [];

    // Step 2: Guard — already upvoted?
    if (
      upvotedApps.some(
        (app: any) => app.uid === applicationUid
      )
    ) {
      // Return canonical upvote count so UI can render correctly.
      const appRes = await fetch(
        `${API_BASE}/content_types/application/entries/${applicationUid}`,
        {
          headers: {
            api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
            authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
          },
        }
      );

      if (!appRes.ok) {
        const details = await appRes.text();
        console.error('Failed to fetch application entry:', details);
        return NextResponse.json(
          { error: 'Failed to fetch application' },
          { status: 502 }
        );
      }

      const appJson = await appRes.json();
      const app = appJson.entry;

      return NextResponse.json({
        success: true,
        alreadyUpvoted: true,
        upvotes: app?.upvotes || 0,
      });
    }

    // Step 3: Fetch application
    const appRes = await fetch(
      `${API_BASE}/content_types/application/entries/${applicationUid}`,
      {
        headers: {
          api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
        },
      }
    );

    if (!appRes.ok) {
      const details = await appRes.text();
      console.error('Failed to fetch application entry:', details);
      return NextResponse.json(
        { error: 'Failed to fetch application' },
        { status: 502 }
      );
    }

    const appJson = await appRes.json();
    const app = appJson.entry;

    // Step 4: Increment upvotes
    const nextUpvotes = (app?.upvotes || 0) + 1;
    const updateAppRes = await fetch(
      `${API_BASE}/content_types/application/entries/${applicationUid}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
        },
        body: JSON.stringify({
          entry: {
            upvotes: nextUpvotes,
          },
        }),
      }
    );

    if (!updateAppRes.ok) {
      const details = await updateAppRes.text();
      console.error('Failed to update application upvotes:', details);
      return NextResponse.json(
        { error: 'Failed to update upvotes' },
        { status: 502 }
      );
    }

    // Step 4b: Publish the entry so the Delivery API reflects updated upvotes
    try {
      await publishApplicationEntry({
        applicationUid,
        locale: app?.locale,
      });
    } catch (e) {
      console.error('Failed to publish application after upvote:', e);
      // We still return success for the mutation, but delivery may lag until published.
      // If you prefer strict consistency, we can instead return 502 here.
    }

    // Step 5: Update user references
    const updateUserRes = await fetch(
      `${API_BASE}/content_types/users/entries/${user.uid}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
          authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
        },
        body: JSON.stringify({
          entry: {
            upvoted_applications: [
              ...upvotedApps.map((a: any) => ({
                uid: a.uid,
                _content_type_uid: 'application',
              })),
              {
                uid: applicationUid,
                _content_type_uid: 'application',
              },
            ],
          },
        }),
      }
    );

    if (!updateUserRes.ok) {
      const details = await updateUserRes.text();
      console.error('Failed to update user upvoted_applications:', details);
      // We already incremented the app counter; surface error so we can spot/repair.
      return NextResponse.json(
        { error: 'Failed to update user upvote record' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      alreadyUpvoted: false,
      upvotes: nextUpvotes,
    });
  } catch (error) {
    console.error('Upvote failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
