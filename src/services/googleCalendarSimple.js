// Simplified Google Calendar using backend API

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

class GoogleCalendarSimple {
  // Get JWT token for backend authentication
  getJwtToken() {
    return localStorage.getItem('jwt_token');
  }

  // Get Google access token from backend
  async getAccessToken() {
    try {
      const jwtToken = this.getJwtToken();
      if (!jwtToken) {
        return null;
      }

      // Request Google access token from backend
      const response = await fetch(`${API_BASE_URL}/google/token`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data?.accessToken || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Get upcoming events using REST API
  async getUpcomingEvents(maxResults = 10) {
    const token = await this.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated with Google. Please log in with Google OAuth.');
    }

    const timeMin = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `maxResults=${maxResults}&` +
      `singleEvents=true&` +
      `orderBy=startTime`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items || [];
  }

  // Create event using REST API
  async createEventFromTask(task) {
    const token = await this.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated with Google. Please log in with Google OAuth.');
    }

    const event = {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: task.dueDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(new Date(task.dueDate).getTime() + 60 * 60 * 1000).toISOString(),
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

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create calendar event');
    }

    return await response.json();
  }
}

const googleCalendarSimple = new GoogleCalendarSimple();
export default googleCalendarSimple;
