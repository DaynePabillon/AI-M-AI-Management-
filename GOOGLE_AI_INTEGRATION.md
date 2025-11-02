# 🚀 Google Services + AI Integration Guide

Complete guide to integrate Google Workspace and AI capabilities into SkyFlow PM.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Services Setup](#google-services-setup)
3. [AI Services Setup](#ai-services-setup)
4. [Integration Examples](#integration-examples)
5. [Smart Features](#smart-features)

---

## 🔧 Prerequisites

### 1. Install Dependencies

```bash
cd AI-M-AI-Management-
npm install gapi-script @google/generative-ai openai
```

### 2. Update .env File

```env
# Google OAuth (already have)
REACT_APP_GOOGLE_CLIENT_ID=435162604229-9ja5kvdm8tb9dh5udfvb3slg4rsfku5m.apps.googleusercontent.com

# Google API Key (get from Google Cloud Console)
REACT_APP_GOOGLE_API_KEY=your-google-api-key-here

# AI Provider (choose one)
REACT_APP_AI_PROVIDER=gemini
# OR
# REACT_APP_AI_PROVIDER=openai

# Gemini API Key (free tier available)
REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here

# OpenAI API Key (paid)
REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
```

---

## 🔑 Google Services Setup

### Step 1: Enable APIs in Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Select your project (or create new one)
3. Enable these APIs:
   - ✅ Google Calendar API
   - ✅ Google Drive API
   - ✅ Google Sheets API
   - ✅ Google Classroom API

### Step 2: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key
4. Add to `.env` as `REACT_APP_GOOGLE_API_KEY`

### Step 3: Update OAuth Scopes

In Google Cloud Console → **OAuth consent screen**:
- Add scopes:
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/spreadsheets`
  - `https://www.googleapis.com/auth/classroom.courses.readonly`

---

## 🤖 AI Services Setup

### Option 1: Google Gemini (Recommended - Free Tier)

1. Go to: https://makersuite.google.com/app/apikey
2. Click **Create API Key**
3. Copy and add to `.env` as `REACT_APP_GEMINI_API_KEY`
4. Set `REACT_APP_AI_PROVIDER=gemini`

**Pros:**
- ✅ Free tier with generous limits
- ✅ Fast response times
- ✅ Good for project management tasks
- ✅ No credit card required

### Option 2: OpenAI GPT-4 (Paid)

1. Go to: https://platform.openai.com/api-keys
2. Create API key
3. Add to `.env` as `REACT_APP_OPENAI_API_KEY`
4. Set `REACT_APP_AI_PROVIDER=openai`

**Pros:**
- ✅ More advanced reasoning
- ✅ Better for complex analysis
- ❌ Requires payment

---

## 💡 Integration Examples

### Example 1: Sync Task to Google Calendar

```javascript
import googleCalendarService from './services/googleCalendarService';

const handleSyncToCalendar = async (task) => {
  try {
    const event = await googleCalendarService.createEventFromTask(task);
    console.log('Event created:', event.htmlLink);
    alert('Task synced to Google Calendar!');
  } catch (error) {
    console.error('Failed to sync:', error);
  }
};
```

### Example 2: Create Project Folder in Google Drive

```javascript
import googleDriveService from './services/googleDriveService';

const handleCreateProjectFolder = async (project) => {
  try {
    const folder = await googleDriveService.createProjectFolder(project.name);
    console.log('Folder created:', folder.webViewLink);
    
    // Share with team
    const teamEmails = project.members.map(m => m.email);
    await googleDriveService.shareFolderWithTeam(folder.id, teamEmails);
    
    alert('Project folder created and shared!');
  } catch (error) {
    console.error('Failed to create folder:', error);
  }
};
```

### Example 3: Generate AI Insights

```javascript
import aiService from './services/aiService';

const handleGenerateInsights = async () => {
  try {
    const insights = await aiService.generateProjectInsights(project, tasks);
    
    console.log('Health Score:', insights.healthScore);
    console.log('Risks:', insights.risks);
    console.log('Recommendations:', insights.recommendations);
    
    setProjectInsights(insights);
  } catch (error) {
    console.error('Failed to generate insights:', error);
  }
};
```

### Example 4: Smart Task Suggestions

```javascript
const handleSuggestTasks = async () => {
  try {
    const suggestions = await aiService.suggestTasks(project, tasks);
    
    // Show suggestions to user
    setSuggestedTasks(suggestions);
  } catch (error) {
    console.error('Failed to suggest tasks:', error);
  }
};
```

---

## 🎯 Smart Features to Implement

### 1. **AI-Powered Dashboard Widget**

Add to Dashboard.js:

```javascript
import { useState, useEffect } from 'react';
import aiService from '../services/aiService';

const AIInsightsWidget = ({ project, tasks }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const data = await aiService.generateProjectInsights(project, tasks);
      setInsights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insights-widget">
      <h3>🤖 AI Insights</h3>
      {loading ? (
        <p>Analyzing project...</p>
      ) : insights ? (
        <div>
          <div className="health-score">
            Health Score: {insights.healthScore}/10
          </div>
          <div className="risks">
            <h4>Risks:</h4>
            <ul>
              {insights.risks.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="recommendations">
            <h4>Recommendations:</h4>
            <ul>
              {insights.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={generateInsights}>Generate Insights</button>
      )}
    </div>
  );
};
```

### 2. **Google Calendar Sync Button**

Add to Task component:

```javascript
import { Calendar } from 'lucide-react';
import googleCalendarService from '../services/googleCalendarService';

const TaskItem = ({ task }) => {
  const handleSyncToCalendar = async () => {
    try {
      await googleCalendarService.createEventFromTask(task);
      alert('✅ Synced to Google Calendar!');
    } catch (error) {
      alert('❌ Failed to sync: ' + error.message);
    }
  };

  return (
    <div className="task-item">
      <h4>{task.title}</h4>
      <button onClick={handleSyncToCalendar}>
        <Calendar size={16} /> Sync to Calendar
      </button>
    </div>
  );
};
```

### 3. **Smart Meeting Agenda Generator**

```javascript
import aiService from '../services/aiService';

const MeetingAgendaGenerator = ({ project, tasks, team }) => {
  const [agenda, setAgenda] = useState('');

  const generateAgenda = async () => {
    const result = await aiService.generateMeetingAgenda(project, tasks, team);
    setAgenda(result);
  };

  return (
    <div>
      <button onClick={generateAgenda}>Generate Meeting Agenda</button>
      {agenda && (
        <div className="agenda-preview">
          <pre>{agenda}</pre>
          <button onClick={() => navigator.clipboard.writeText(agenda)}>
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};
```

### 4. **Project Folder Auto-Creation**

Add to Project creation:

```javascript
import googleDriveService from '../services/googleDriveService';

const handleCreateProject = async (projectData) => {
  // Create project in database
  const project = await createProject(projectData);
  
  // Auto-create Google Drive folder
  try {
    const folder = await googleDriveService.createProjectFolder(project.name);
    
    // Save folder link to project
    await updateProject(project.id, {
      driveFolderId: folder.id,
      driveFolderLink: folder.webViewLink,
    });
    
    // Share with team
    if (projectData.teamMembers?.length > 0) {
      await googleDriveService.shareFolderWithTeam(
        folder.id,
        projectData.teamMembers.map(m => m.email)
      );
    }
  } catch (error) {
    console.error('Failed to create Drive folder:', error);
  }
};
```

---

## 🎨 UI Components to Add

### 1. AI Insights Card (Dashboard)

```jsx
<div className="ai-insights-card">
  <div className="card-header">
    <Sparkles size={20} />
    <h3>AI Insights</h3>
  </div>
  <div className="insights-content">
    <div className="health-meter">
      <div className="meter-bar" style={{ width: `${healthScore * 10}%` }} />
      <span>{healthScore}/10</span>
    </div>
    <div className="quick-stats">
      <div className="stat">
        <TrendingUp size={16} />
        <span>On Track</span>
      </div>
      <div className="stat warning">
        <AlertTriangle size={16} />
        <span>2 Risks</span>
      </div>
    </div>
  </div>
</div>
```

### 2. Google Integration Panel

```jsx
<div className="google-integrations">
  <h3>Google Workspace</h3>
  <div className="integration-buttons">
    <button onClick={syncToCalendar}>
      <Calendar size={18} />
      Sync to Calendar
    </button>
    <button onClick={openDriveFolder}>
      <FolderOpen size={18} />
      Open Drive Folder
    </button>
    <button onClick={createSheet}>
      <FileSpreadsheet size={18} />
      Export to Sheets
    </button>
  </div>
</div>
```

---

## 🚀 Quick Start Checklist

- [ ] Install dependencies: `npm install gapi-script @google/generative-ai`
- [ ] Get Google API Key from Cloud Console
- [ ] Get Gemini API Key from MakerSuite
- [ ] Update `.env` with API keys
- [ ] Enable Google APIs (Calendar, Drive, Sheets)
- [ ] Update OAuth scopes
- [ ] Test Calendar sync
- [ ] Test Drive folder creation
- [ ] Test AI insights generation
- [ ] Add UI components to Dashboard

---

## 📚 Next Steps

1. **Implement AI Insights Widget** on Dashboard
2. **Add Calendar Sync** to all tasks
3. **Auto-create Drive folders** for new projects
4. **Generate smart task suggestions** using AI
5. **Create meeting agendas** automatically
6. **Export reports** to Google Sheets
7. **Track productivity** with AI analysis

---

## 🎉 You're Ready!

Your SkyFlow PM now has:
- ✅ Google Calendar integration
- ✅ Google Drive integration
- ✅ AI-powered insights
- ✅ Smart task suggestions
- ✅ Automated meeting agendas
- ✅ Team productivity analysis

**Start with one feature at a time and expand!** 🚀
