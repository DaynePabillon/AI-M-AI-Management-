import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Loader } from 'lucide-react';
import aiService from '../services/aiService';
import './AIInsights.css';

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState('key-insights');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      const sampleProject = { name: 'E-commerce Platform', progress: 72, status: 'IN_PROGRESS' };
      const sampleTasks = [
        { title: 'Frontend', status: 'IN_PROGRESS', priority: 'HIGH' },
        { title: 'Backend API', status: 'IN_PROGRESS', priority: 'HIGH' },
        { title: 'Testing', status: 'TODO', priority: 'MEDIUM' },
        { title: 'Deployment', status: 'TODO', priority: 'HIGH' },
        { title: 'Documentation', status: 'COMPLETED', priority: 'LOW' },
      ];
      const insights = await aiService.generateProjectInsights(sampleProject, sampleTasks);
      setAiData(insights);
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'AI Confidence Score', value: '92%', icon: Sparkles, color: '#a855f7', trend: null },
    { label: 'Insights Generated', value: '24', subtitle: 'This week', icon: Lightbulb, color: '#f59e0b' },
    { label: 'Actions Recommended', value: '8', subtitle: 'Pending review', icon: AlertTriangle, color: '#3b82f6' },
    { label: 'Efficiency Gain', value: '+18%', subtitle: 'From AI recommendations', icon: TrendingUp, color: '#10b981' },
  ];

  const insights = [
    {
      title: 'Team Productivity Peak Detected',
      description: 'Your team shows highest productivity on Tuesdays and Fridays. Consider scheduling important meetings and reviews on these days.',
      confidence: '94%',
      priority: 'High',
      type: 'success',
      icon: TrendingUp,
    },
    {
      title: 'Resource Reallocation Opportunity',
      description: 'Mobile App Launch project is ahead of schedule. Consider moving 2 developers to help with the delayed Brand Guidelines project.',
      confidence: '91%',
      priority: 'High',
      type: 'info',
      icon: Lightbulb,
    },
    {
      title: 'Potential Scope Creep Risk',
      description: 'E-commerce Redesign project shows signs of expanding beyond original requirements. 23% more tasks added than planned.',
      confidence: '87%',
      priority: 'Medium',
      type: 'warning',
      icon: AlertTriangle,
    },
    {
      title: 'Deadline Risk Alert',
      description: 'Based on current velocity, Brand Guidelines project has 78% chance of missing December 30th deadline without intervention.',
      confidence: '96%',
      priority: 'Critical',
      type: 'danger',
      icon: TrendingDown,
    },
  ];

  return (
    <div className="ai-insights">
      <div className="page-header">
        <div>
          <div className="page-header-icon">
            <Sparkles size={24} />
          </div>
          <h1 className="page-title">AI Insights & Analytics</h1>
          <p className="page-subtitle">AI-personalized insights to optimize your project management</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Sparkles size={16} />
            AI Analysis Active
          </button>
          <button className="btn-primary" onClick={loadAIInsights} disabled={loading}>
            {loading ? <Loader className="spinner" size={16} /> : <RefreshCw size={16} />}
            {loading ? 'Analyzing...' : 'Refresh Analysis'}
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
              {stat.subtitle && <div className="stat-subtitle">{stat.subtitle}</div>}
              {stat.value === '92%' && (
                <div className="stat-progress">
                  <div className="stat-progress-bar" style={{ width: '92%', background: stat.color }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'key-insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('key-insights')}
        >
          Key Insights
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          Predictions
        </button>
        <button 
          className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
      </div>

      {/* Insights List */}
      <div className="insights-list">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className={`insight-card ${insight.type}`}>
              <div className="insight-header">
                <div className="insight-icon-wrapper">
                  <div className={`insight-icon ${insight.type}`}>
                    <Icon size={24} />
                  </div>
                  <div className="insight-title-wrapper">
                    <h3 className="insight-title">{insight.title}</h3>
                    <div className="insight-badges">
                      <span className={`priority-badge ${insight.priority.toLowerCase()}`}>
                        {insight.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="insight-description">{insight.description}</p>
              
              <div className="insight-footer">
                <div className="confidence-indicator">
                  <span className="confidence-label">AI Confidence:</span>
                  <span className="confidence-value">{insight.confidence}</span>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: insight.confidence }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
