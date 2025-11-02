# 🧪 Integration Testing Guide

## 🚀 How to Test Google + AI Integrations

### Step 1: Access the Test Page

Once your app is running (`npm start`), go to:

```
http://localhost:3000/integration-test
```

Or manually navigate by typing in the browser URL bar.

### Step 2: What You'll See

A beautiful test dashboard with 3 sections:

#### 📅 Google Calendar Tests
- **Get Upcoming Events** - Fetches your next 5 calendar events
- **Create Test Event** - Creates a sample task event in your calendar

#### 📁 Google Drive Tests  
- **Create Project Folder** - Creates a "Website Redesign" folder in your Drive

#### 🤖 AI Insights Tests
- **Generate Project Insights** - AI analyzes sample project and gives health score, risks, recommendations
- **Suggest Tasks** - AI suggests 5 additional tasks for the project
- **Generate Meeting Agenda** - AI creates a structured meeting agenda

### Step 3: Click Any Button to Test

Each button will:
1. Show a loading spinner
2. Call the respective API
3. Display results in a nice formatted box
4. Show errors with troubleshooting tips if something fails

---

## 📋 Pre-Test Checklist

Before testing, make sure:

### ✅ .env File is Complete

```env
REACT_APP_GOOGLE_CLIENT_ID=435162604229-9ja5kvdm8tb9dh5udfvb3slg4rsfku5m.apps.googleusercontent.com
REACT_APP_GOOGLE_API_KEY=your-actual-key-here
REACT_APP_GEMINI_API_KEY=your-actual-key-here
REACT_APP_AI_PROVIDER=gemini
```

### ✅ Google APIs Enabled

In Google Cloud Console, enable:
- Google Calendar API
- Google Drive API

### ✅ Logged In

Make sure you're logged into the app with your Google account.

---

## 🎯 Expected Results

### Google Calendar - Get Events
```json
[
  {
    "summary": "Team Meeting",
    "start": { "dateTime": "2024-01-15T10:00:00Z" },
    "htmlLink": "https://calendar.google.com/..."
  }
]
```

### Google Drive - Create Folder
```json
{
  "id": "1a2b3c4d5e6f",
  "name": "Website Redesign",
  "webViewLink": "https://drive.google.com/..."
}
```

### AI Insights
```json
{
  "healthScore": 7,
  "risks": [
    "High priority tasks pending",
    "Potential deadline pressure"
  ],
  "recommendations": [
    "Allocate more resources to frontend development",
    "Schedule daily standups for better coordination"
  ],
  "predictedCompletion": "2024-03-25"
}
```

---

## 🐛 Troubleshooting

### Error: "API key not valid"
- Check if `REACT_APP_GOOGLE_API_KEY` is set in `.env`
- Verify the key is correct in Google Cloud Console
- Restart the app after updating `.env`

### Error: "Access not configured"
- Enable the API in Google Cloud Console
- Wait 1-2 minutes for changes to propagate

### Error: "Authentication required"
- Make sure you're logged in with Google OAuth
- Check if access token is valid

### Error: "AI service failed"
- Verify `REACT_APP_GEMINI_API_KEY` is set
- Check if you have API quota remaining
- Try switching to OpenAI if Gemini fails

---

## 📊 What Each Test Does

### 1. Get Calendar Events
**Purpose:** Verify Google Calendar API connection  
**What it does:** Fetches your upcoming calendar events  
**Use case:** Display upcoming deadlines in dashboard

### 2. Create Calendar Event
**Purpose:** Test write access to calendar  
**What it does:** Creates a test event 7 days from now  
**Use case:** Auto-sync task deadlines to calendar

### 3. Create Drive Folder
**Purpose:** Test Google Drive API  
**What it does:** Creates a project folder in your Drive  
**Use case:** Auto-create folders for new projects

### 4. Generate AI Insights
**Purpose:** Test AI analysis capabilities  
**What it does:** Analyzes project health and provides recommendations  
**Use case:** Smart project dashboard insights

### 5. Suggest Tasks
**Purpose:** Test AI task generation  
**What it does:** Suggests additional tasks based on project context  
**Use case:** Help PMs identify missing tasks

### 6. Generate Meeting Agenda
**Purpose:** Test AI content generation  
**What it does:** Creates structured meeting agenda  
**Use case:** Auto-generate agendas for standup meetings

---

## 🎨 Next Steps After Testing

Once tests pass, you can:

1. **Add to Dashboard** - Show AI insights on main dashboard
2. **Add to Tasks** - Add "Sync to Calendar" button on each task
3. **Add to Projects** - Auto-create Drive folder when creating project
4. **Add to Team** - Show productivity insights for team members

---

## 🚀 Quick Commands

```bash
# Start the app
npm start

# Navigate to test page
# http://localhost:3000/integration-test

# Check console for detailed logs
# Open browser DevTools (F12) -> Console tab
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Buttons respond when clicked
- ✅ Loading spinner appears
- ✅ Green success message shows
- ✅ JSON data displays in formatted box
- ✅ No red error messages
- ✅ Console shows successful API calls

---

## 🎉 You're Ready!

If all tests pass, your integrations are working! You can now:
- Build real features using these services
- Add AI insights to your dashboard
- Sync tasks to Google Calendar
- Create project folders automatically
- Generate smart recommendations

**Happy testing!** 🚀
