import Stack from './contentstack-management';
import DeliveryStack from './contentstack';

/**
 * Create a new application entry in Contentstack
 */
export async function createApplication(data: {
  title: string;
  url: string;
  app_description: string;
  main_description: string;
  application_status: string;
  app_category?: string;
  app_tags?: string[];
  maintainer_name?: string;
  getting_started?: string;
  app_key_features?: any[];
  app_useful_links?: any[];
  contributed_by: string;
  contribution_status: string;
}) {
  try {
    const entry = await Stack.contentType('application').entry().create({
      entry: data,
    });
    return entry;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  try {
    const response = await DeliveryStack.ContentType('users')
      .Query()
      .where('email', email)
      .includeReference(['upvoted_applications', 'liked_applications'])
      .toJSON()
      .find();

    if (response?.[0] && response[0].length > 0) {
      return response[0][0];
    }
    return null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * Get application entry by UID
 */
export async function getApplicationByUid(uid: string) {
  try {
    const entry = await Stack.contentType('application').entry(uid).fetch();
    return entry;
  } catch (error) {
    console.error(`Error fetching application ${uid}:`, error);
    return null;
  }
}

/**
 * Update application upvotes
 */
export async function incrementApplicationUpvotes(applicationUid: string) {
  try {
    // Fetch current entry from Management API (latest draft, not published)
    const app = await Stack.contentType('application').entry(applicationUid).fetch();
    const currentUpvotes = Number(app?.upvotes) || 0;
    const nextUpvotes = currentUpvotes + 1;

    // Set the field on the fetched object and call .update()
    app.upvotes = nextUpvotes;
    const updatedApp = await app.update();

    console.log(`incrementApplicationUpvotes - ${applicationUid}: ${currentUpvotes} → ${nextUpvotes}`);
    return { updatedApp, upvotes: nextUpvotes };
  } catch (error) {
    console.error(`Error incrementing upvotes for ${applicationUid}:`, error);
    throw error;
  }
}

/**
 * Update user's upvoted applications list
 */
export async function addUpvotedApplication(userUid: string, applicationUid: string) {
  try {
    // Fetch latest draft from Management API (NOT Delivery) to avoid stale data
    const user = await Stack.contentType('users').entry(userUid).fetch();

    if (!user) {
      console.error('addUpvotedApplication - User not found:', userUid);
      return null;
    }

    const upvotedApps: any[] = user.upvoted_applications || [];
    console.log(`addUpvotedApplication - current count: ${upvotedApps.length}, version: ${user._version}`);

    // Add new application if not already upvoted
    if (!upvotedApps.some((app: any) => app.uid === applicationUid)) {
      upvotedApps.push({
        uid: applicationUid,
        _content_type_uid: 'application',
      });
    } else {
      console.log('addUpvotedApplication - already in list, skipping');
      return user;
    }

    // Mutate the fetched object and call .update() — SDK handles versioning
    user.upvoted_applications = upvotedApps;
    const updatedUser = await user.update();

    console.log(`addUpvotedApplication - updated to ${upvotedApps.length} apps, version: ${updatedUser._version}`);
    return updatedUser;
  } catch (error) {
    console.error('addUpvotedApplication - Error:', {
      userUid,
      applicationUid,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Update user's liked applications list
 */
export async function addLikedApplication(userUid: string, applicationUid: string) {
  try {
    // Fetch latest draft from Management API (NOT Delivery) to avoid stale data
    const user = await Stack.contentType('users').entry(userUid).fetch();

    if (!user) {
      console.error('addLikedApplication - User not found:', userUid);
      return null;
    }

    const likedApps: any[] = user.liked_applications || [];
    console.log(`addLikedApplication - current count: ${likedApps.length}, version: ${user._version}`);

    // Add new application if not already liked
    if (!likedApps.some((app: any) => app.uid === applicationUid)) {
      likedApps.push({
        uid: applicationUid,
        _content_type_uid: 'application',
      });
    } else {
      console.log('addLikedApplication - already in list, skipping');
      return user;
    }

    // Mutate the fetched object and call .update() — SDK handles versioning
    user.liked_applications = likedApps;
    const updatedUser = await user.update();

    console.log(`addLikedApplication - updated to ${likedApps.length} apps, version: ${updatedUser._version}`);
    return updatedUser;
  } catch (error) {
    console.error('addLikedApplication - Error:', {
      userUid,
      applicationUid,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Publish an entry to specified environments
 */
export async function publishEntry(params: {
  contentTypeUid: string;
  entryUid: string;
  environments: string[];
  locales?: string[];
}) {
  try {
    const { contentTypeUid, entryUid, environments, locales = ['en-us'] } = params;

    const publishedEntry = await Stack.contentType(contentTypeUid)
      .entry(entryUid)
      .publish({
        publishDetails: {
          environments,
          locales,
        },
      });

    return publishedEntry;
  } catch (error) {
    console.error(
      `Error publishing entry ${params.entryUid} to ${params.environments?.join(', ')}:`,
      error
    );
    throw error;
  }
}
