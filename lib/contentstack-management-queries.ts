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
    // Fetch current upvotes
    const app = await Stack.contentType('application').entry(applicationUid).fetch();
    const currentUpvotes = app?.upvotes || 0;
    const nextUpvotes = currentUpvotes + 1;

    // Update with new upvotes
    const updatedApp = await Stack.contentType('application')
      .entry(applicationUid)
      .update({
        entry: {
          upvotes: nextUpvotes,
        },
      });

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
    console.log('addUpvotedApplication - Fetching user:', userUid);
    console.log('addUpvotedApplication - Management token present:', !!process.env.CONTENTSTACK_MANAGEMENT_TOKEN);
    console.log('addUpvotedApplication - API key:', process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY);
    
    // Fetch user using Management API to get version info
    const user = await Stack.contentType('users').entry(userUid).fetch();
    
    if (!user) {
      console.error('addUpvotedApplication - User not found:', userUid);
      return null;
    }

    console.log('addUpvotedApplication - User fetched, version:', user._version);
    let upvotedApps = user?.upvoted_applications || [];
    console.log('addUpvotedApplication - Current upvoted apps:', upvotedApps.length);
    console.log('addUpvotedApplication - Current apps structure:', JSON.stringify(upvotedApps.slice(0, 2), null, 2));

    // Add new application if not already upvoted
    if (!upvotedApps.some((app: any) => app.uid === applicationUid)) {
      upvotedApps.push({
        uid: applicationUid,
        _content_type_uid: 'application',
      });
      console.log('addUpvotedApplication - Added new app to upvoted list');
    } else {
      console.log('addUpvotedApplication - App already in upvoted list');
    }

    // Update user entry with version info
    console.log('addUpvotedApplication - Updating user entry with', upvotedApps.length, 'apps');
    console.log('addUpvotedApplication - Update payload:', JSON.stringify({
      upvoted_applications: upvotedApps.slice(0, 2),
    }, null, 2));
    
    const updatedUser = await Stack.contentType('users')
      .entry(userUid)
      .update({
        entry: {
          upvoted_applications: upvotedApps,
          _version: user._version,
        },
      });

    console.log('addUpvotedApplication - Successfully updated user, new version:', updatedUser._version);
    return updatedUser;
  } catch (error) {
    console.error('addUpvotedApplication - Error:', {
      error,
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
    console.log('addLikedApplication - Fetching user:', userUid);
    console.log('addLikedApplication - Management token present:', !!process.env.CONTENTSTACK_MANAGEMENT_TOKEN);
    console.log('addLikedApplication - API key:', process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY);
    
    // Fetch user using Management API to get version info
    const user = await Stack.contentType('users').entry(userUid).fetch();
    
    if (!user) {
      console.error('addLikedApplication - User not found:', userUid);
      return null;
    }

    console.log('addLikedApplication - User fetched, version:', user._version);
    let likedApps = user.liked_applications || [];
    console.log('addLikedApplication - Current liked apps:', likedApps.length);
    console.log('addLikedApplication - Current apps structure:', JSON.stringify(likedApps.slice(0, 2), null, 2));

    // Add new application if not already liked
    if (!likedApps.some((app: any) => app.uid === applicationUid)) {
      likedApps.push({
        uid: applicationUid,
        _content_type_uid: 'application',
      });
      console.log('addLikedApplication - Added new app to liked list');
    } else {
      console.log('addLikedApplication - App already in liked list');
    }

    // Update user entry with version info
    console.log('addLikedApplication - Updating user entry with', likedApps.length, 'apps');
    console.log('addLikedApplication - Update payload:', JSON.stringify({
      liked_applications: likedApps.slice(0, 2),
    }, null, 2));
    
    const updatedUser = await Stack.contentType('users')
      .entry(userUid)
      .update({
        entry: {
          liked_applications: likedApps,
          _version: user._version,
        },
      });

    console.log('addLikedApplication - Successfully updated user, new version:', updatedUser._version);
    return updatedUser;
  } catch (error) {
    console.error('addLikedApplication - Error:', {
      error,
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
