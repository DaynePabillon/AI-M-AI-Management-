import React, { useState } from 'react';
import { Users, MessageSquare, Phone, Video, Mail, Calendar } from 'lucide-react';
import './Team.css';

const Team = () => {
  const [activeTab, setActiveTab] = useState('team-members');

  const stats = [
    { label: 'Team Members', value: '5', subtitle: '1 online now', icon: Users, color: '#3b82f6' },
    { label: 'Active Conversations', value: '8', subtitle: '2 new messages', icon: MessageSquare, color: '#10b981' },
    { label: 'Team Productivity', value: '90%', subtitle: '+5% from last week', icon: Users, color: '#a855f7' },
    { label: 'Meetings Today', value: '3', subtitle: 'Next in 15 min', icon: Calendar, color: '#f97316' },
  ];

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Project Manager',
      avatar: 'JD',
      status: 'online',
      currentTask: 'Sprint Planning Review',
      productivity: '92%',
      tasksCompleted: 38,
      teamMemberSince: '1/15/2024',
    },
    {
      name: 'Sarah Wilson',
      role: 'Senior Developer',
      avatar: 'SW',
      status: 'online',
      currentTask: 'API Integration',
      productivity: '88%',
      tasksCompleted: 24,
      teamMemberSince: '2/1/2024',
    },
    {
      name: 'Alex Rodriguez',
      role: 'UI/UX Designer',
      avatar: 'AR',
      status: 'away',
      currentTask: 'Design System Update',
      productivity: '95%',
      tasksCompleted: 31,
      teamMemberSince: '1/20/2024',
    },
    {
      name: 'Katie Liu',
      role: 'DevOps Engineer',
      avatar: 'KL',
      status: 'offline',
      currentTask: 'CI/CD Pipeline',
      productivity: '90%',
      tasksCompleted: 20,
      teamMemberSince: '2/15/2024',
    },
    {
      name: 'Mike Chen',
      role: 'QA Engineer',
      avatar: 'MC',
      status: 'online',
      currentTask: 'Test Automation',
      productivity: '87%',
      tasksCompleted: 29,
      teamMemberSince: '1/25/2024',
    },
  ];

  return (
    <div className="team">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Collaboration</h1>
          <p className="page-subtitle">Connect, communicate, and collaborate with your team</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Phone size={16} />
            Voice Call
          </button>
          <button className="btn-primary">
            <Video size={16} />
            Video Call
          </button>
        </div>
      </div>

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

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'team-members' ? 'active' : ''}`}
          onClick={() => setActiveTab('team-members')}
        >
          Team Members
        </button>
        <button 
          className={`tab ${activeTab === 'team-chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('team-chat')}
        >
          Team Chat
        </button>
        <button 
          className={`tab ${activeTab === 'activity-feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity-feed')}
        >
          Activity Feed
        </button>
        <button 
          className={`tab ${activeTab === 'meetings' ? 'active' : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          Meetings
        </button>
      </div>

      {/* Team Members Grid */}
      {activeTab === 'team-members' && (
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="member-card">
              <div className="member-header">
                <div className="member-avatar-wrapper">
                  <div className="member-avatar" style={{ 
                    background: `linear-gradient(135deg, ${
                      member.status === 'online' ? '#10b981' : 
                      member.status === 'away' ? '#f59e0b' : '#6b7280'
                    } 0%, ${
                      member.status === 'online' ? '#059669' : 
                      member.status === 'away' ? '#d97706' : '#4b5563'
                    } 100%)`
                  }}>
                    {member.avatar}
                  </div>
                  <div className={`status-indicator ${member.status}`}></div>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                </div>
              </div>

              <div className="member-current-task">
                <span className="task-label">Current Task</span>
                <span className="task-name">{member.currentTask}</span>
              </div>

              <div className="member-stats">
                <div className="member-stat">
                  <span className="stat-label">Productivity</span>
                  <span className="stat-value">{member.productivity}</span>
                  <div className="productivity-bar">
                    <div 
                      className="productivity-fill" 
                      style={{ width: member.productivity }}
                    ></div>
                  </div>
                </div>
                <div className="member-stat-row">
                  <div className="member-stat-item">
                    <span className="stat-label">Tasks Completed</span>
                    <span className="stat-value">{member.tasksCompleted}</span>
                  </div>
                  <div className="member-stat-item">
                    <span className="stat-label">Team Member Since</span>
                    <span className="stat-value">{member.teamMemberSince}</span>
                  </div>
                </div>
              </div>

              <div className="member-actions">
                <button className="action-btn">
                  <Mail size={16} />
                </button>
                <button className="action-btn">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
