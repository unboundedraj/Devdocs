import Stack from './contentstack';
import { Homepage } from '@/types/homepage';
import { Application } from '@/types/application';
import { Supportpage } from '@/types/supportpage';
import { Changelog } from '@/types/changelog';
import { ThemeSettings } from '@/types/theme';


export async function getThemeSettings(): Promise<ThemeSettings | null> {
  try {
    const response = await Stack.ContentType('theme_settings')
      .Query()
      .toJSON()
      .findOne();
    
    return response as ThemeSettings;
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return null;
  }
}

export async function getHomepage(): Promise<Homepage | null> {
  try {
    const response = await Stack.ContentType('homepage')
      .Entry('bltYOUR_ENTRY_UID') // You might need the specific entry UID, or use .Query().findOne()
      .toJSON()
      .fetch();

    return response as Homepage;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

// Alternative if you don't know the entry UID:
export async function getHomepageByQuery(): Promise<Homepage | null> {
  try {
    const response = await Stack.ContentType('homepage')
      .Query()
.includeReference(['featured_applications'])
.includeReferenceContentTypeUID()
      .toJSON()
      .findOne();

    return response as Homepage;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}


export async function getAllApplications(): Promise<Application[]> {
  try {
    const response = await Stack.ContentType('application')
      .Query()
      .toJSON()
      .find();

    // Contentstack returns response as [entries, count] or {entries: [], count: number}
    // Handle both response formats
    let applications: any[] = [];
    
    if (Array.isArray(response)) {
      // If response is an array, first element is entries array
      applications = response[0] || [];
    } else if (response && typeof response === 'object') {
      // If response is an object, check for entries property
      applications = response.entries || response[0] || [];
    }

    // Ensure upvotes field is properly mapped (handle both upvotes and upvotes_count)
    // Also ensure it's a number, defaulting to 0 if undefined/null
    const mappedApplications = applications.map((app: any) => {
      // Check for upvotes in multiple possible field names
      let upvotesValue: number = 0;
      
      if (app.upvotes !== undefined && app.upvotes !== null) {
        upvotesValue = typeof app.upvotes === 'number' ? app.upvotes : parseInt(String(app.upvotes)) || 0;
      } else if (app.upvotes_count !== undefined && app.upvotes_count !== null) {
        upvotesValue = typeof app.upvotes_count === 'number' ? app.upvotes_count : parseInt(String(app.upvotes_count)) || 0;
      }
      
      return {
        ...app,
        upvotes: upvotesValue,
      };
    });

    return mappedApplications as Application[];
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

// Get single application by UID - Using Query
export async function getApplicationByUid(uid: string): Promise<Application | null> {
  try {
    const response = await Stack.ContentType('application')
      .Entry(uid)
      .toJSON()
      .fetch();

    // Ensure upvotes field is properly mapped
    let upvotesValue: number = 0;
    const appResponse = response as any;
    
    if (appResponse.upvotes !== undefined && appResponse.upvotes !== null) {
      upvotesValue = typeof appResponse.upvotes === 'number' ? appResponse.upvotes : parseInt(String(appResponse.upvotes)) || 0;
    } else if (appResponse.upvotes_count !== undefined && appResponse.upvotes_count !== null) {
      upvotesValue = typeof appResponse.upvotes_count === 'number' ? appResponse.upvotes_count : parseInt(String(appResponse.upvotes_count)) || 0;
    }
    
    return {
      ...appResponse,
      upvotes: upvotesValue,
    } as Application;
  } catch (error) {
    console.error(`Error fetching application ${uid}:`, error);
    return null;
  }
}



export async function getSupportPage(): Promise<Supportpage | null> {
  try {
    const response = await Stack.ContentType('supportpage')
      .Query()
      .toJSON()
      .findOne();

    return response as Supportpage;
  } catch (error) {
    console.error('Error fetching support page:', error);
    return null;
  }
}

// Get all changelogs for a specific application
export async function getChangelogsByApplicationUid(applicationUid: string): Promise<Changelog[]> {
  try {
    const response = await Stack.ContentType('changelog')
      .Query()
      .toJSON()
      .find();


    const allChangelogs = response[0] || [];
    
    // Filter changelogs for this specific application
    const appChangelogs = allChangelogs.filter((changelog: any) => {
      // Check if application_reference matches the applicationUid
      if (Array.isArray(changelog.application_reference)) {
        return changelog.application_reference.some((ref: any) => ref.uid === applicationUid);
      }
      return changelog.application_reference?.uid === applicationUid;
    });

    // Sort by release_date descending (newest first)
    return appChangelogs.sort((a: any, b: any) => {
      const dateA = new Date(a.release_date || a.created_at);
      const dateB = new Date(b.release_date || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error(`Error fetching changelogs for application ${applicationUid}:`, error);
    return [];
  }
}

export const getFAQs = async () => {
  try {
    const Query = Stack.ContentType('faq')
      .Query()
      .where('is_active', true)
      .ascending('order')
      .toJSON()

    const result = await Query.find()

    return result?.[0] || []
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}
