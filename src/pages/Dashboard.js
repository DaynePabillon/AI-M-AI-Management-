import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Calendar, Users, Cloud } from 'lucide-react';
import AIInsightsWidget from '../components/AIInsightsWidget';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalTasks: 0,
    tasksDueSoon: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Check if there's a token in the URL (from OAuth2 redirect)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Store the JWT token
      localStorage.setItem('jwt_token', token);
      // Remove token from URL
      navigate('/dashboard', { replace: true });
    }
    
    // Load real data
    loadDashboardData();
  }, [location, navigate]);
  
  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return;
      
      // Fetch projects
      const projectsRes = await fetch(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const projectsData = await projectsRes.json();
      const projectsList = projectsData.data || [];
      setProjects(projectsList);
      
      // Fetch all tasks from all projects
      const allTasks = [];
      for (const project of projectsList) {
        try {
          const tasksRes = await fetch(`${API_URL}/projects/${project.id}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const tasksData = await tasksRes.json();
          const tasksList = tasksData.data || [];
          allTasks.push(...tasksList);
        } catch (err) {
          console.error('Error loading tasks for project:', project.id);
        }
      }
      setTasks(allTasks);
      
      // Calculate stats
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const tasksDueSoon = allTasks.filter(t => 
        t.dueDate && new Date(t.dueDate) <= sevenDaysFromNow && new Date(t.dueDate) >= now
      ).length;
      const completedTasks = allTasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length;
      const completionRate = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
      
      setStats({
        activeProjects: projectsList.length,
        totalTasks: allTasks.length,
        tasksDueSoon,
        completionRate
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };
  
  const statsDisplay = [
    { label: 'Active Projects', value: stats.activeProjects.toString(), subtitle: 'Total projects', icon: TrendingUp, color: '#3b82f6' },
    { label: 'Total Tasks', value: stats.totalTasks.toString(), subtitle: `${stats.completionRate}% completed`, icon: Users, color: '#10b981' },
    { label: 'Tasks due soon', value: stats.tasksDueSoon.toString(), subtitle: 'Next 7 days', icon: Calendar, color: '#a855f7' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, subtitle: 'Overall progress', icon: Clock, color: '#f97316' },
  ];

  // Calculate task distribution from real data
  const taskDistribution = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length, color: '#10b981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#3b82f6' },
    { name: 'Backlog', value: tasks.filter(t => t.status === 'BACKLOG' || t.status === 'TODO').length, color: '#f59e0b' },
    { name: 'Blocked', value: tasks.filter(t => t.status === 'BLOCKED' || t.status === 'REVIEW').length, color: '#ef4444' },
  ];

  // Get recent projects with progress
  const recentProjects = projects.slice(0, 3).map(project => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const completedTasks = projectTasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length;
    const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
    const priority = projectTasks.some(t => t.priority === 'HIGH' || t.priority === 'CRITICAL') ? 'High' : 
                     projectTasks.some(t => t.priority === 'MEDIUM') ? 'Medium' : 'Low';
    return {
      name: project.name,
      progress,
      status: priority,
      dueDate: project.dueDate || new Date().toISOString()
    };
  });

  // Get upcoming tasks (next 7 days)
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingTasks = tasks
    .filter(t => t.dueDate && new Date(t.dueDate) <= sevenDaysFromNow)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3)
    .map(task => {
      const dueDate = new Date(task.dueDate);
      const isOverdue = dueDate < now;
      const isTomorrow = dueDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
      const time = isOverdue ? 'Overdue' : isTomorrow ? 'Tomorrow' : dueDate.toLocaleDateString();
      return {
        title: task.title,
        time,
        date: dueDate.toLocaleDateString(),
        priority: task.priority
      };
    });

  // Calculate weekly project data (last 6 weeks)
  const projectData = Array.from({ length: 6 }, (_, i) => {
    const weekStart = new Date(now.getTime() - (5 - i) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekTasks = tasks.filter(t => {
      const createdAt = new Date(t.createdAt);
      return createdAt >= weekStart && createdAt < weekEnd;
    });
    return {
      name: `Week ${i + 1}`,
      completed: weekTasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length,
      inProgress: weekTasks.filter(t => t.status === 'IN_PROGRESS').length
    };
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Good morning, {user?.name || 'User'}! 👋</h1>
          <p className="dashboard-subtitle">Here's an AI-insights overview on your workspace today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statsDisplay.map((stat, index) => {
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

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card large">
          <div className="card-header">
            <div>
              <h3 className="card-title">Project Progress Overview</h3>
              <p className="card-subtitle">Weekly comparison on in progress projects</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inProgress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Task Distribution</h3>
              <p className="card-subtitle">Current task status breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {taskDistribution.map((item, index) => (
              <div key={index} className="legend-item">
                <div className="legend-color" style={{ background: item.color }}></div>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="list-card">
          <div className="card-header">
            <h3 className="card-title">Recent Progress</h3>
            <p className="card-subtitle">Your latest active projects this week</p>
          </div>
          <div className="project-list">
            {recentProjects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-info">
                  <div className="project-name">{project.name}</div>
                  <div className="project-progress-bar">
                    <div 
                      className="project-progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="project-meta">
                  <span className={`status-badge ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                  <span className="project-progress-text">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="list-card">
          <div className="card-header">
            <h3 className="card-title">Today's Schedule</h3>
            <p className="card-subtitle">Upcoming tasks and deadlines</p>
          </div>
          <div className="task-list">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="task-item">
                <div className="task-indicator"></div>
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  <div className="task-time">{task.time}</div>
                </div>
                <span className={`task-badge ${task.time === 'Overdue' ? 'critical' : 'normal'}`}>
                  {task.time === 'Overdue' ? 'Critical' : 'Normal'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AIInsightsWidget 
          project={{
            name: 'Overall Workspace',
            description: `You have ${stats.activeProjects} active projects with ${stats.totalTasks} total tasks. ${stats.tasksDueSoon} tasks are due in the next 7 days. Your completion rate is ${stats.completionRate}%.`,
            status: 'IN_PROGRESS',
            progress: stats.completionRate,
            totalProjects: stats.activeProjects,
            totalTasks: stats.totalTasks,
            tasksDueSoon: stats.tasksDueSoon
          }}
          tasks={tasks}
        />

        <div className="integration-card">
          <div className="integration-icon">
            <Cloud size={32} />
          </div>
          <h3 className="integration-title">Cloud Calendar Sync 🔗</h3>
          <p className="integration-text">
            Tasks automatically sync with Google Calendar and Drive attachments are linked to Google Drive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
