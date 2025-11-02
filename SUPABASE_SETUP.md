# 🚀 Supabase Integration Setup Guide

## ✅ What's Been Implemented

Your SkyFlow PM application now has full Supabase integration with:

1. **Authentication System** - Email/Password & Google OAuth
2. **Database Schema** - Complete tables for projects, tasks, teams, etc.
3. **Real-time Subscriptions** - Live updates for collaborative features
4. **Row Level Security** - Secure data access policies
5. **Service Layer** - Clean API for database operations

---

## 📦 Step 1: Install Dependencies

Run this command to install Supabase client:

```bash
npm install @supabase/supabase-js
```

---

## 🔐 Step 2: Create `.env` File

Create a `.env` file in your project root:

```env
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# Supabase
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

⚠️ **Important**: The `.env` file is already in `.gitignore` to keep your credentials safe!

---

## 🗄️ Step 3: Set Up Database Schema

1. **Go to your Supabase Dashboard**: https://app.supabase.com

2. **Navigate to SQL Editor** (left sidebar)

3. **Copy the entire content** from `supabase_schema.sql`

4. **Paste and run** the SQL in the editor

This will create all necessary tables:
- ✅ `user_profiles` - User information
- ✅ `projects` - Project management
- ✅ `tasks` - Task tracking
- ✅ `team_members` - Team collaboration
- ✅ `calendar_events` - Calendar integration
- ✅ `comments` - Task comments
- ✅ `ai_insights` - AI-generated insights
- ✅ `activity_log` - Activity tracking

---

## 🔑 Step 4: Configure Google OAuth in Supabase

1. **Go to Authentication > Providers** in Supabase Dashboard

2. **Enable Google Provider**

3. **Add your Google OAuth credentials**:
   - Client ID: `your_google_client_id_here`
   - Client Secret: `your_google_client_secret_here`

4. **Add Redirect URLs**:
   - Development: `http://localhost:3000/**`
   - Production: `https://yourdomain.com/**`

5. **Configure Scopes** (for Google API access):
   ```
   email
   profile
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/drive
   https://www.googleapis.com/auth/classroom.courses.readonly
   ```

---

## 🔒 Step 5: Configure Row Level Security (RLS)

The SQL schema already includes RLS policies, but verify they're enabled:

1. **Go to Authentication > Policies** in Supabase Dashboard

2. **Verify policies exist** for each table:
   - Users can only see their own data
   - Project members can access project data
   - Proper insert/update/delete permissions

---

## 🧪 Step 6: Test the Integration

### Test Email/Password Authentication:

1. **Start your app**:
   ```bash
   npm start
   ```

2. **Navigate to** `http://localhost:3000`

3. **Click "Sign up"** and create an account

4. **Check your email** for verification link

5. **Sign in** with your credentials

### Test Google OAuth:

1. **Click "Continue with Google"**

2. **Select your Google account**

3. **Grant permissions**

4. **You should be redirected** to the dashboard

---

## 📊 Step 7: Verify Database Tables

After signing up, check your Supabase Dashboard:

1. **Go to Table Editor**

2. **Check `auth.users`** - Your user should appear

3. **Check `user_profiles`** - Profile should be auto-created

---

## 🎯 Features Now Available

### Authentication
- ✅ Email/Password registration
- ✅ Email/Password login
- ✅ Google OAuth login
- ✅ Email verification
- ✅ Password reset
- ✅ Session management
- ✅ Auto profile creation

### Database Operations
- ✅ Create/Read/Update/Delete projects
- ✅ Create/Read/Update/Delete tasks
- ✅ Manage team members
- ✅ Calendar events
- ✅ Comments on tasks
- ✅ AI insights storage
- ✅ Activity logging

### Real-time Features
- ✅ Live project updates
- ✅ Live task updates
- ✅ Collaborative editing

---

## 🔧 Using the Services

### Authentication Service

```javascript
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle,
  signOut 
} from './services/authService';

// Sign up
const { data, error } = await signUpWithEmail(email, password, fullName);

// Sign in
const { data, error } = await signInWithEmail(email, password);

// Google OAuth
const { data, error } = await signInWithGoogle();

// Sign out
await signOut();
```

### Database Service

```javascript
import { 
  getProjects, 
  createProject, 
  updateProject,
  getTasks,
  createTask 
} from './services/databaseService';

// Get user's projects
const { data: projects, error } = await getProjects(userId);

// Create a project
const { data: newProject, error } = await createProject({
  name: 'My Project',
  description: 'Project description',
  owner_id: userId,
  status: 'active'
});

// Get project tasks
const { data: tasks, error } = await getTasks(projectId);

// Create a task
const { data: newTask, error } = await createTask({
  project_id: projectId,
  title: 'Task title',
  description: 'Task description',
  status: 'todo',
  assignee_id: userId
});
```

---

## 🔄 Real-time Subscriptions

```javascript
import { subscribeToProjects, subscribeToTasks } from './services/databaseService';

// Subscribe to project changes
const subscription = subscribeToProjects(userId, (payload) => {
  console.log('Project changed:', payload);
  // Update UI
});

// Unsubscribe when component unmounts
subscription.unsubscribe();
```

---

## 🛡️ Security Best Practices

### ✅ Already Implemented:
- Row Level Security (RLS) enabled
- Secure authentication flow
- Environment variables for secrets
- HTTPS-only in production
- JWT token management

### 🔒 Additional Recommendations:
1. **Enable email verification** in Supabase settings
2. **Set up password requirements** (min length, complexity)
3. **Configure rate limiting** for auth endpoints
4. **Enable 2FA** for admin accounts
5. **Regular security audits** of RLS policies

---

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `REACT_APP_SUPABASE_URL` | Supabase Project URL | Yes |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase Anonymous Key | Yes |

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
- Check that your `.env` file exists
- Verify the Supabase URL and key are correct
- Restart your development server after creating `.env`

### Issue: "Email not verified"
- Check your email inbox (and spam folder)
- Resend verification email from Supabase Dashboard
- Or disable email verification in Supabase settings for testing

### Issue: "Google OAuth not working"
- Verify Google OAuth is enabled in Supabase
- Check redirect URLs match exactly
- Ensure Google Client ID/Secret are correct

### Issue: "RLS policy violation"
- Check that policies are enabled for the table
- Verify user is authenticated
- Check policy conditions match your use case

### Issue: "Real-time not working"
- Enable Realtime in Supabase Dashboard for specific tables
- Check browser console for connection errors
- Verify subscription code is correct

---

## 📚 Next Steps

### 1. Integrate with Existing Pages

Update your Dashboard, Projects, and Team pages to use real data:

```javascript
import { useEffect, useState } from 'react';
import { getProjects } from '../services/databaseService';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    const { data, error } = await getProjects(user.id);
    if (!error) {
      setProjects(data);
    }
  };

  return (
    // Your dashboard UI
  );
}
```

### 2. Add Google API Integration

Once authenticated, use the session token to call Google APIs:

```javascript
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session.provider_token; // Google access token

// Use this token to call Google Calendar, Drive, etc.
```

### 3. Implement AI Insights

Store and retrieve AI-generated insights:

```javascript
import { supabase } from '../lib/supabaseClient';

const saveInsight = async (insight) => {
  const { data, error } = await supabase
    .from('ai_insights')
    .insert([{
      user_id: userId,
      project_id: projectId,
      insight_type: 'productivity',
      title: insight.title,
      description: insight.description,
      confidence_score: 0.92,
      priority: 'high'
    }]);
};
```

---

## 🎉 You're All Set!

Your SkyFlow PM application now has:
- ✅ Full authentication system
- ✅ Secure database with RLS
- ✅ Real-time collaboration
- ✅ Google OAuth integration
- ✅ Ready for Google API integration
- ✅ Scalable architecture

**Next**: Integrate real data into your existing UI components and add Google API calls for Calendar, Drive, Sheets, and Classroom!

---

## 📞 Support

If you encounter any issues:
1. Check the Supabase Dashboard logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Review the SQL schema execution logs

Happy coding! 🚀
