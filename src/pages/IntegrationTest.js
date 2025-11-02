import { useState } from 'react';
import { Calendar, FolderOpen, Sparkles, FileText, TrendingUp, Users } from 'lucide-react';
import googleCalendarService from '../services/googleCalendarSimple';
// import googleDriveService from '../services/googleDriveService';
import aiService from '../services/aiService';
import './IntegrationTest.css';

const IntegrationTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Sample test data
  const sampleTask = {
    title: 'Complete Project Proposal',
    description: 'Finalize and submit the Q1 project proposal',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    priority: 'HIGH',
  };

  const sampleProject = {
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern UI/UX',
    status: 'IN_PROGRESS',
    progress: 65,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
  };

  const sampleTasks = [
    { id: 1, title: 'Design mockups', status: 'COMPLETED', priority: 'HIGH' },
    { id: 2, title: 'Frontend development', status: 'IN_PROGRESS', priority: 'HIGH' },
    { id: 3, title: 'Backend API', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    { id: 4, title: 'Testing', status: 'TODO', priority: 'HIGH' },
    { id: 5, title: 'Deployment', status: 'TODO', priority: 'MEDIUM' },
  ];

  const sampleTeam = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ];

  const handleTest = async (testName, testFunction) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await testFunction();
      setResult({ testName, data });
      console.log(`${testName} Result:`, data);
    } catch (err) {
      setError({ testName, message: err.message });
      console.error(`${testName} Error:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Test functions
  const testCalendarEvents = async () => {
    const events = await googleCalendarService.getUpcomingEvents(5);
    return events;
  };

  const testCreateCalendarEvent = async () => {
    const event = await googleCalendarService.createEventFromTask(sampleTask);
    return event;
  };

  const testCreateDriveFolder = async () => {
    // const folder = await googleDriveService.createProjectFolder(sampleProject.name);
    // return folder;
    throw new Error('Google Drive integration coming soon! Focus on Calendar and AI for now.');
  };

  const testAIInsights = async () => {
    const insights = await aiService.generateProjectInsights(sampleProject, sampleTasks);
    return insights;
  };

  const testAITaskSuggestions = async () => {
    const suggestions = await aiService.suggestTasks(sampleProject, sampleTasks);
    return suggestions;
  };

  const testAIMeetingAgenda = async () => {
    const agenda = await aiService.generateMeetingAgenda(sampleProject, sampleTasks, sampleTeam);
    return agenda;
  };

  return (
    <div className="integration-test-page">
      <div className="test-header">
        <h1>🧪 Integration Test Dashboard</h1>
        <p>Test Google Services and AI integrations</p>
      </div>

      <div className="test-sections">
        {/* Google Calendar Tests */}
        <div className="test-section">
          <div className="section-header">
            <Calendar size={24} />
            <h2>Google Calendar</h2>
          </div>
          <div className="test-buttons">
            <button
              onClick={() => handleTest('Get Calendar Events', testCalendarEvents)}
              disabled={loading}
              className="test-button"
            >
              Get Upcoming Events
            </button>
            <button
              onClick={() => handleTest('Create Calendar Event', testCreateCalendarEvent)}
              disabled={loading}
              className="test-button"
            >
              Create Test Event
            </button>
          </div>
        </div>

        {/* Google Drive Tests */}
        <div className="test-section">
          <div className="section-header">
            <FolderOpen size={24} />
            <h2>Google Drive</h2>
          </div>
          <div className="test-buttons">
            <button
              onClick={() => handleTest('Create Drive Folder', testCreateDriveFolder)}
              disabled={loading}
              className="test-button"
            >
              Create Project Folder
            </button>
          </div>
        </div>

        {/* AI Tests */}
        <div className="test-section">
          <div className="section-header">
            <Sparkles size={24} />
            <h2>AI Insights</h2>
          </div>
          <div className="test-buttons">
            <button
              onClick={() => handleTest('Generate AI Insights', testAIInsights)}
              disabled={loading}
              className="test-button"
            >
              <TrendingUp size={16} />
              Generate Project Insights
            </button>
            <button
              onClick={() => handleTest('AI Task Suggestions', testAITaskSuggestions)}
              disabled={loading}
              className="test-button"
            >
              <FileText size={16} />
              Suggest Tasks
            </button>
            <button
              onClick={() => handleTest('AI Meeting Agenda', testAIMeetingAgenda)}
              disabled={loading}
              className="test-button"
            >
              <Users size={16} />
              Generate Meeting Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="test-result loading">
          <div className="spinner"></div>
          <p>Testing integration...</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="test-result error">
          <h3>❌ {error.testName} Failed</h3>
          <p>{error.message}</p>
          <details>
            <summary>Troubleshooting</summary>
            <ul>
              <li>Check if API keys are set in .env file</li>
              <li>Verify Google APIs are enabled in Cloud Console</li>
              <li>Make sure you're signed in with Google OAuth</li>
              <li>Check browser console for detailed errors</li>
            </ul>
          </details>
        </div>
      )}

      {/* Success Display */}
      {result && (
        <div className="test-result success">
          <h3>✅ {result.testName} Successful!</h3>
          <div className="result-data">
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Sample Data Display */}
      <div className="sample-data">
        <h3>📊 Test Data Being Used</h3>
        <div className="data-grid">
          <div className="data-card">
            <h4>Sample Task</h4>
            <pre>{JSON.stringify(sampleTask, null, 2)}</pre>
          </div>
          <div className="data-card">
            <h4>Sample Project</h4>
            <pre>{JSON.stringify(sampleProject, null, 2)}</pre>
          </div>
          <div className="data-card">
            <h4>Sample Tasks ({sampleTasks.length})</h4>
            <pre>{JSON.stringify(sampleTasks, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTest;
