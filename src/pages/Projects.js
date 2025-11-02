import React, { useState } from 'react';
import { Plus, MoreVertical, Calendar, MessageSquare, Paperclip, Sparkles } from 'lucide-react';
import aiService from '../services/aiService';
import './Projects.css';

const Projects = () => {
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const generateInsights = async () => {
    setLoadingAI(true);
    try {
      const allTasks = columns.flatMap(col => col.tasks.map(t => ({
        ...t,
        status: col.id === 'done' ? 'COMPLETED' : col.id === 'in-progress' ? 'IN_PROGRESS' : 'TODO'
      })));
      const insights = await aiService.generateProjectInsights(
        { name: 'E-commerce Redesign', progress: 65, status: 'IN_PROGRESS' },
        allTasks
      );
      setAiInsights(insights);
      alert(`AI Insights:\n\nHealth Score: ${insights.healthScore}/10\n\nRisks:\n${insights.risks?.join('\n') || 'None'}\n\nRecommendations:\n${insights.recommendations?.join('\n') || 'None'}`);
    } catch (err) {
      alert('Failed to generate insights: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };
  const columns = [
    {
      id: 'backlog',
      title: 'Backlog',
      count: 2,
      color: '#e5e7eb',
      tasks: [
        {
          title: 'User Research Analysis',
          description: 'Analyze user feedback from surveys',
          priority: 'Medium',
          dueDate: '2024-10-30',
          assignee: 'Medium',
          comments: 1,
          attachments: 0,
        },
        {
          title: 'Performance Optimization',
          description: 'Optimize app loading times',
          priority: 'Low',
          dueDate: '2024-12-31',
          assignee: 'MC',
          comments: 1,
          attachments: 0,
        },
      ],
    },
    {
      id: 'todo',
      title: 'To Do',
      count: 2,
      color: '#3b82f6',
      tasks: [
        {
          title: 'Homepage Redesign',
          description: 'Update homepage with new branding',
          priority: 'High',
          dueDate: '2024-10-15',
          assignee: 'AR',
          comments: 2,
          attachments: 1,
        },
        {
          title: 'API Documentation',
          description: 'Update API docs for v2.0 release',
          priority: 'Medium',
          dueDate: '2024-12-15',
          assignee: 'KL',
          comments: 2,
          attachments: 1,
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      count: 2,
      color: '#f59e0b',
      tasks: [
        {
          title: 'Mobile App Testing',
          description: 'Comprehensive testing of mobile app features',
          priority: 'Critical',
          dueDate: '2024-11-08',
          assignee: 'MC',
          comments: 4,
          attachments: 2,
        },
        {
          title: 'Database Migration',
          description: 'Migrate legacy database to new schema',
          priority: 'High',
          dueDate: '2024-11-12',
          assignee: 'MC',
          comments: 4,
          attachments: 2,
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      count: 1,
      color: '#ec4899',
      tasks: [
        {
          title: 'UI Component Library',
          description: 'Design and implement reusable UI components',
          priority: 'Medium',
          dueDate: '2024-11-08',
          assignee: 'AR',
          comments: 0,
          attachments: 0,
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      count: 2,
      color: '#10b981',
      tasks: [
        {
          title: 'Login System Upgrade',
          description: 'Implement OAuth2 authentication',
          priority: 'High',
          dueDate: '2024-11-07',
          assignee: 'SW',
          comments: 3,
          attachments: 0,
        },
        {
          title: 'Email Templates',
          description: 'Create responsive email templates',
          priority: 'Medium',
          dueDate: '2024-11-03',
          assignee: 'Lisa',
          comments: 3,
          attachments: 0,
        },
      ],
    },
  ];

  return (
    <div className="projects">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Board</h1>
          <p className="page-subtitle">Manage your projects with Kanban-style boards</p>
        </div>
        <div className="header-actions">
          <select className="project-select">
            <option>E-commerce Redesign</option>
            <option>Mobile App Launch</option>
            <option>Brand Guidelines</option>
          </select>
          <button className="btn-secondary" onClick={generateInsights} disabled={loadingAI}>
            <Sparkles size={16} />
            {loadingAI ? 'Analyzing...' : 'AI Insights'}
          </button>
          <button className="btn-primary">
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {columns.map((column) => (
          <div key={column.id} className="kanban-column">
            <div className="column-header">
              <div className="column-title-wrapper">
                <h3 className="column-title">{column.title}</h3>
                <span className="column-count">{column.count}</span>
              </div>
            </div>

            <div className="column-content">
              {column.tasks.map((task, index) => (
                <div key={index} className="task-card">
                  <div className="task-header">
                    <span className={`task-priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <button className="task-menu">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-description">{task.description}</p>

                  <div className="task-footer">
                    <div className="task-meta">
                      <span className="task-date">
                        <Calendar size={12} />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      {task.comments > 0 && (
                        <span className="task-comments">
                          <MessageSquare size={12} />
                          {task.comments}
                        </span>
                      )}
                      {task.attachments > 0 && (
                        <span className="task-attachments">
                          <Paperclip size={12} />
                          {task.attachments}
                        </span>
                      )}
                    </div>
                    <div className="task-assignee" title={task.assignee}>
                      {task.assignee}
                    </div>
                  </div>
                </div>
              ))}

              <button className="add-task-btn">
                <Plus size={16} />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Notice */}
      <div className="integration-notice">
        <div className="notice-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="notice-content">
          <h4 className="notice-title">Google Workspace Integration</h4>
          <p className="notice-text">
            Tasks automatically sync with Google Calendar and Drive attachments are linked to Google Drive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
