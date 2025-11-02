/* global gapi */
// gapi is loaded from the script tag in index.html

const CALENDAR_ID = 'primary';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

class GoogleCalendarService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize Google Calendar API
  async init() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Check if gapi is loaded
      if (typeof gapi === 'undefined') {
        reject(new Error('Google API (gapi) not loaded. Make sure the script tag is in index.html'));
        return;
      }

      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: SCOPES,
          });
          this.isInitialized = true;
          resolve();
        } catch (error) {
          console.error('Google Calendar init error:', error);
          reject(error);
        }
      });
    });
  }

  // Get upcoming events
  async getUpcomingEvents(maxResults = 10) {
    await this.init();

    const response = await gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: maxResults,
      orderBy: 'startTime',
    });

    return response.result.items;
  }

  // Create event from task
  async createEventFromTask(task) {
    await this.init();

    const event = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: task.dueDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(new Date(task.dueDate).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    return response.result;
  }

  // Create event from project milestone
  async createProjectMilestone(project, milestone) {
    await this.init();

    const event = {
      summary: `${project.name} - ${milestone.title}`,
      description: `Project: ${project.name}\nMilestone: ${milestone.description}`,
      start: {
        date: milestone.dueDate.split('T')[0], // All-day event
      },
      end: {
        date: milestone.dueDate.split('T')[0],
      },
      colorId: '9', // Blue color for projects
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    return response.result;
  }

  // Sync all project deadlines
  async syncProjectDeadlines(projects) {
    const results = [];
    
    for (const project of projects) {
      if (project.endDate) {
        const event = await this.createProjectMilestone(project, {
          title: 'Project Deadline',
          description: project.description,
          dueDate: project.endDate,
        });
        results.push(event);
      }
    }

    return results;
  }
}

const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;
