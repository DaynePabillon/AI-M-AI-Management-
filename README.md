# SkyFlow PM - Cloud Project Suite

A Google-Integrated Project Management System with AI Insights designed for schools, universities, and educators.

## 🎯 Project Overview

SkyFlow PM is an AI-assisted project and class management system that combines Google Workspace tools (Sheets, Classroom, Drive, Calendar) into one unified platform with intelligent insights.

## ✨ Features

- **Dashboard**: Overview with statistics, charts, and recent activity
- **Google Apps Integration**: Seamless sync with Calendar, Drive, Gmail, and Meet
- **AI Insights & Analytics**: AI-powered insights for project optimization
- **Team Collaboration**: Team member management with productivity tracking
- **Project Board**: Kanban-style task management
- **Calendar**: Schedule management with Google Calendar sync

## 🛠️ Tech Stack

- **Frontend**: React.js 18
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Custom CSS

## 📦 Installation

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\Dayne Pabillon\Desktop\AI integrated PM stuff\AI-M-AI-Management-"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
AI-M-AI-Management-/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js
│   │   └── Layout.css
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── GoogleApps.js
│   │   ├── GoogleApps.css
│   │   ├── AIInsights.js
│   │   ├── AIInsights.css
│   │   ├── Team.js
│   │   ├── Team.css
│   │   ├── Projects.js
│   │   ├── Projects.css
│   │   ├── Calendar.js
│   │   └── Calendar.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎨 Pages

### 1. Dashboard
- Greeting with personalized message
- Key statistics (Active Projects, Team Members, Tasks, Completion Time)
- Project progress charts
- Task distribution pie chart
- Recent projects and upcoming tasks

### 2. Google Apps Integration
- Calendar events overview
- Drive files activity
- Quick actions for Google services
- Tabs for Overview, Calendar, Drive, Gmail, Meet

### 3. AI Insights & Analytics
- AI confidence score
- Insights generated count
- Recommended actions
- Efficiency gain metrics
- Detailed insights with priority levels

### 4. Team Collaboration
- Team member cards with status indicators
- Productivity tracking
- Current task display
- Communication options (Email, Chat)

### 5. Project Board
- Kanban-style board with 5 columns (Backlog, To Do, In Progress, Review, Done)
- Task cards with priority, due date, assignee
- Drag-and-drop functionality (ready for implementation)
- Project selector

### 6. Calendar
- Monthly calendar view
- Today's events sidebar
- Google Calendar sync option
- Event indicators

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color Scheme**: Purple/blue gradient theme (#667eea to #764ba2)
- **Icons**: Lucide React icons throughout
- **Smooth Animations**: Hover effects and transitions

## 🚀 Next Steps

To fully implement the system as described in your project plan:

1. **Backend Integration**:
   - Set up Spring Boot backend
   - Configure Google Cloud Firestore/Firebase
   - Implement Google APIs (Sheets, Classroom, Drive, Calendar)

2. **Authentication**:
   - Implement OAuth 2.0 with Google
   - Add JWT token management
   - Role-based access control

3. **AI Integration**:
   - Connect to Vertex AI (Google Cloud)
   - Implement AI insights generation
   - Add predictive analytics

4. **Real-time Features**:
   - WebSocket for live updates
   - Real-time collaboration
   - Notifications system

5. **Mobile App**:
   - Develop Flutter mobile application
   - Sync with web platform

## 📝 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🔐 Security Notes

- Implement proper authentication before deployment
- Never commit API keys or sensitive credentials
- Use environment variables for configuration
- Follow Philippine Data Privacy Act of 2012 compliance

## 👥 Target Users

- Teachers/Professors
- Students
- School Administrators

## 📄 License

This project is part of an academic project management system.

## 🤝 Contributing

This is an educational project. For contributions or questions, please contact the project team.

---

**Built with ❤️ for educational institutions**