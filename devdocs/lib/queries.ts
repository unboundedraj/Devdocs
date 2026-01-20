import Stack from './contentstack';
import { Homepage } from '@/types/homepage';
import { Application } from '@/types/application';
import { Supportpage } from '@/types/supportpage';
import { Changelog } from '@/types/changelog';




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

    return response[0] || [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

// Get single application by UID - Using Query
export async function getApplicationByUid(uid: string): Promise<Application | null> {
  try {
    console.log('Fetching application with UID:', uid);
    
    const response = await Stack.ContentType('application')
      .Query()
      .toJSON()
      .find();

    console.log('All applications:', response[0]); // See all apps
    
    // Find the one matching the UID
    const application = response[0]?.find((app: any) => app.uid === uid);
    
    console.log('Found application:', application);
    return application || null;
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

    // Filter changelogs that reference this application
    // Since we don't know the exact reference structure, we'll get all for now
    // and filter based on the application_reference field
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