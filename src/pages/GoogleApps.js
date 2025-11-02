import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, Mail, Video, ExternalLink, Users, Link as LinkIcon } from 'lucide-react';
import './GoogleApps.css';

const GoogleApps = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Calendar Events', value: '12', subtitle: 'This week', icon: CalendarIcon, color: '#3b82f6' },
    { label: 'Drive Files', value: '47', subtitle: 'Project files', icon: FileText, color: '#10b981' },
    { label: 'Unread Emails', value: '8', subtitle: 'Project related', icon: Mail, color: '#ef4444' },
    { label: 'Meet Sessions', value: '24', subtitle: 'This month', icon: Video, color: '#8b5cf6' },
  ];

  const quickActions = [
    { icon: CalendarIcon, label: 'Schedule Meeting' },
    { icon: FileText, label: 'Create Document' },
    { icon: Mail, label: 'Share Files' },
    { icon: Video, label: 'Send Update' },
  ];

  const calendarEvents = [
    {
      title: 'Project Kickoff Meeting',
      time: '9:00 AM - 10:00 AM',
      attendees: '3 attendees',
      location: 'Rm 202',
    },
    {
      title: 'Design Review Session',
      time: '2:00 PM - 3:30 PM',
      attendees: '3 attendees',
      location: 'VC DC 04',
    },
    {
      title: 'Sprint Planning',
      time: '4:00 PM - 5:00 PM',
      attendees: '3 attendees',
      location: 'Rm 0',
    },
  ];

  const driveFiles = [
    {
      name: 'Project-Requirements.docx',
      modified: '2 hours ago',
      sharedWith: '3 people',
      size: '2.4 KB',
    },
    {
      name: 'Design-Mockups.figma',
      modified: '1 day ago',
      sharedWith: '5 people',
      size: '12.5 MB',
    },
    {
      name: 'Technical-specs.pdf',
      modified: '2 days ago',
      sharedWith: '4 people',
      size: '1.2 MB',
    },
  ];

  const todaySchedule = [
    {
      title: 'Project Kickoff Meeting',
      time: '9:00 AM - 10:00 AM',
      attendees: '3 attendees',
      location: 'Rm 202',
    },
    {
      title: 'Design Review Session',
      time: '2:00 PM - 3:30 PM',
      attendees: '3 attendees',
      location: 'VC DC 04',
    },
    {
      title: 'Sprint Planning',
      time: '4:00 PM - 5:00 PM',
      attendees: '3 attendees',
      location: 'Rm 0',
    },
  ];

  return (
    <div className="google-apps">
      <div className="page-header">
        <div>
          <h1 className="page-title">Google Workspace Integration</h1>
          <p className="page-subtitle">Seamlessly connect your projects with Google services</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <LinkIcon size={16} />
            Connected to Google Workspace
          </button>
          <button className="btn-primary">Configure</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button 
          className={`tab ${activeTab === 'drive' ? 'active' : ''}`}
          onClick={() => setActiveTab('drive')}
        >
          Drive
        </button>
        <button 
          className={`tab ${activeTab === 'gmail' ? 'active' : ''}`}
          onClick={() => setActiveTab('gmail')}
        >
          Gmail
        </button>
        <button 
          className={`tab ${activeTab === 'meet' ? 'active' : ''}`}
          onClick={() => setActiveTab('meet')}
        >
          Meet
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats */}
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">{stat.label}</span>
                    <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-subtitle">{stat.subtitle}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="section-card">
            <h3 className="section-title">Quick Actions</h3>
            <p className="section-subtitle">Common Google Workspace integrations for your projects</p>
            <div className="quick-actions">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button key={index} className="action-button">
                    <Icon size={20} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-grid">
            <div className="section-card">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Recent Calendar Events</h3>
                  <p className="section-subtitle">Upcoming meetings and events</p>
                </div>
              </div>
              <div className="event-list">
                {calendarEvents.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-icon">
                      <CalendarIcon size={20} />
                    </div>
                    <div className="event-info">
                      <div className="event-title">{event.title}</div>
                      <div className="event-meta">
                        <span className="event-time">{event.time}</span>
                        <span className="event-attendees">
                          <Users size={12} />
                          {event.attendees}
                        </span>
                      </div>
                    </div>
                    <button className="icon-btn">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Recent Drive Activity</h3>
                  <p className="section-subtitle">Recently modified project files</p>
                </div>
              </div>
              <div className="file-list">
                {driveFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-icon">
                      <FileText size={20} />
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        <span>Modified {file.modified}</span>
                        <span>Shared with {file.sharedWith}</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                    <button className="icon-btn">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'calendar' && (
        <div className="section-card">
          <div className="section-header">
            <div>
              <h3 className="section-title">Today's Schedule</h3>
              <p className="section-subtitle">Your Google Calendar events for today</p>
            </div>
          </div>
          <div className="schedule-list">
            {todaySchedule.map((event, index) => (
              <div key={index} className="schedule-item">
                <div className="schedule-icon">
                  <CalendarIcon size={24} />
                </div>
                <div className="schedule-info">
                  <div className="schedule-title">{event.title}</div>
                  <div className="schedule-time">
                    <CalendarIcon size={14} />
                    {event.time}
                  </div>
                  <div className="schedule-meta">
                    <span className="schedule-location">{event.location}</span>
                    <span className="schedule-attendees">
                      <Users size={12} />
                      {event.attendees}
                    </span>
                  </div>
                </div>
                <div className="schedule-actions">
                  <button className="btn-outline">Join Meeting</button>
                  <button className="icon-btn">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleApps;
