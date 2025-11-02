# 🔗 Frontend-Backend Integration Guide

Complete guide to connect your React frontend with Spring Boot backend.

## ✅ What's Been Completed

### Backend (Spring Boot)
- ✅ Complete REST API with 20+ endpoints
- ✅ JWT authentication
- ✅ Database integration (Supabase PostgreSQL)
- ✅ Google API services (Calendar, Drive)
- ✅ Project & Task management
- ✅ Security & CORS configuration

### Frontend (React)
- ✅ Beautiful UI with all pages
- ✅ Supabase authentication
- ✅ Context-based state management
- ✅ Protected routes
- ✅ Google OAuth integration

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### 2. Start Frontend
```bash
cd AI-M-AI-Management-
npm start
```
Frontend runs on: http://localhost:3000

### 3. Update Frontend .env
```env
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# Supabase
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## 📡 API Integration

### Using the API Client

The `src/lib/api.js` file is already created with axios configured:

```javascript
import api from './lib/api';

// All requests automatically include JWT token
const response = await api.get('/projects');
```

### Example Integrations

#### 1. Update AuthService to use Backend

Create `src/services/backendAuthService.js`:
```javascript
import api from '../lib/api';

export const loginWithBackend = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, userId, email: userEmail, fullName } = response.data.data;
  
  // Store token
  localStorage.setItem('token', token);
  
  return {
    id: userId,
    email: userEmail,
    name: fullName,
  };
};

export const registerWithBackend = async (fullName, email, password) => {
  const response = await api.post('/auth/register', {
    fullName,
    email,
    password
  });
  
  const { token, userId } = response.data.data;
  localStorage.setItem('token', token);
  
  return response.data.data;
};
```

#### 2. Fetch Real Projects

Update `src/pages/Dashboard.js`:
```javascript
import { useEffect, useState } from 'react';
import api from '../lib/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
};
```

#### 3. Create Project

```javascript
const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', {
      name: projectData.name,
      description: projectData.description,
      status: 'ACTIVE',
      priority: 'MEDIUM',
      startDate: projectData.startDate,
      endDate: projectData.endDate
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};
```

#### 4. Fetch Tasks

```javascript
const fetchTasks = async (projectId) => {
  try {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
```

#### 5. Google Calendar Integration

```javascript
const fetchCalendarEvents = async () => {
  try {
    const googleToken = localStorage.getItem('googleAccessToken');
    
    const response = await api.get('/google/calendar/events', {
      headers: {
        'X-Google-Token': googleToken
      },
      params: {
        maxResults: 10
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};
```

## 🔄 Dual Authentication Strategy

You can use both Supabase (for frontend) and Backend (for API):

### Option 1: Supabase Only (Current)
- Frontend: Supabase Auth
- Backend: Validates Supabase JWT
- Simpler, uses Supabase's built-in features

### Option 2: Backend Only
- Frontend: Calls backend `/auth/login`
- Backend: Issues own JWT
- More control, custom logic

### Option 3: Hybrid (Recommended)
- Frontend: Supabase for UI auth
- Backend: Validates and extends with custom logic
- Best of both worlds

## 📊 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

### Success Response:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Project Name"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "details": "..."
  }
}
```

## 🔐 Authentication Flow

### 1. User Logs In (Frontend)
```javascript
// User submits login form
const { data, error } = await signInWithEmail(email, password);

// Supabase returns session
const session = data.session;
const supabaseToken = session.access_token;
```

### 2. Exchange for Backend Token (Optional)
```javascript
// Send Supabase token to backend
const response = await api.post('/auth/supabase-verify', {
  supabaseToken
});

// Backend validates and returns own JWT
const backendToken = response.data.data.token;
localStorage.setItem('token', backendToken);
```

### 3. Use Backend Token for API Calls
```javascript
// Axios automatically adds token to headers
const projects = await api.get('/projects');
```

## 🧪 Testing the Integration

### 1. Test Backend Health
```bash
curl http://localhost:8080/api/health
```

### 2. Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test Protected Endpoint
```bash
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Backend already has CORS configured for `http://localhost:3000`

If you need to add more origins, edit `application.yml`:
```yaml
cors:
  allowed-origins: http://localhost:3000,https://yourdomain.com
```

### Issue: 401 Unauthorized
**Solution**: 
- Check if token is stored: `localStorage.getItem('token')`
- Verify token format: `Bearer <token>`
- Check if token is expired

### Issue: Network Error
**Solution**:
- Ensure backend is running on port 8080
- Check `REACT_APP_API_BASE_URL` in `.env`
- Verify firewall settings

### Issue: Database Connection
**Solution**:
- Verify Supabase credentials in `application.yml`
- Check if Supabase database is accessible
- Test connection: `psql -h db.your_supabase_project.supabase.co -U postgres`

## 📝 Complete Integration Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] `.env` file configured with API URL
- [ ] `api.js` client created
- [ ] JWT token stored after login
- [ ] API calls include Authorization header
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Success/error messages shown to user

## 🎯 Next Steps

1. **Replace Mock Data**: Update all pages to fetch real data from backend
2. **Add Loading States**: Show spinners while fetching data
3. **Error Handling**: Display user-friendly error messages
4. **Real-time Updates**: Implement WebSocket or polling for live updates
5. **Google API Integration**: Connect Calendar, Drive, Sheets
6. **AI Insights**: Implement AI-powered analytics

## 📚 API Endpoints Reference

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /auth/google` - Google OAuth
- `GET /auth/me` - Get current user

### Projects
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/{id}` - Get project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Tasks
- `GET /tasks/project/{projectId}` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/{id}` - Get task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Google APIs
- `GET /google/calendar/events` - Get calendar events
- `POST /google/calendar/events` - Create event
- `GET /google/drive/files` - List files
- `POST /google/drive/folders` - Create folder

## 🎉 You're Ready!

Your full-stack application is now set up with:
- ✅ React frontend with beautiful UI
- ✅ Spring Boot backend with REST API
- ✅ Supabase database
- ✅ JWT authentication
- ✅ Google OAuth
- ✅ Google API integration ready
- ✅ Complete CRUD operations

**Start building amazing features!** 🚀
