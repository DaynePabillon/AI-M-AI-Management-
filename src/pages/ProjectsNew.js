import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Calendar, MessageSquare, Paperclip, Sparkles, X, Loader, ArrowRight, CheckCircle } from 'lucide-react';
import aiService from '../services/aiService';
import googleCalendarService from '../services/googleCalendarSimple';
import './Projects.css';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const ProjectsNew = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
  const [syncingTask, setSyncingTask] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      // Backend returns { success: true, data: [...] }
      const projectList = data.data || data || [];
      const projects = Array.isArray(projectList) ? projectList : [];
      
      setProjects(projects);
      if (projects.length > 0) {
        setSelectedProject(projects[0]);
      } else {
        // No projects found - show empty state
        console.warn('No projects found.');
        setProjects([]);
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      // Show empty state on error
      setProjects([]);
      setSelectedProject(null);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (projectId) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` }
      });
      const data = await response.json();
      // Backend returns { success: true, data: [...] }
      const taskList = data.data || data || [];
      setTasks(Array.isArray(taskList) ? taskList : []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setTasks([]);
    }
  };

  const createProject = async () => {
    if (!newProject.name) {
      alert('Please enter a project name');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(newProject)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const createdProject = data.data || data;
      setProjects([...projects, createdProject]);
      setSelectedProject(createdProject);
      setNewProject({ name: '', description: '' });
      setShowAddProject(false);
      alert('✅ Project created successfully!');
    } catch (err) {
      alert('Failed to create project: ' + err.message);
    }
  };

  const createTask = async () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }
    
    if (!selectedProject) {
      alert('No project selected. Please create a project first.');
      return;
    }
    
    try {
      // Convert date to LocalDateTime format if provided
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate ? `${newTask.dueDate}T00:00:00` : null
      };
      
      const response = await fetch(`${API_URL}/projects/${selectedProject.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const createdTask = data.data || data;
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
      setShowAddTask(false);
      
      // Auto-sync to Google Calendar if due date is set
      if (createdTask.dueDate) {
        try {
          await googleCalendarService.createEventFromTask({
            title: createdTask.title,
            description: createdTask.description,
            dueDate: createdTask.dueDate
          });
          alert('✅ Task created and synced to Google Calendar!');
        } catch (err) {
          console.error('Failed to sync to calendar:', err);
          alert('✅ Task created successfully! (Calendar sync failed - check console)');
        }
      } else {
        alert('✅ Task created successfully!');
      }
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    }
  };

  const syncToCalendar = async (task) => {
    setSyncingTask(task.id);
    try {
      await googleCalendarService.createEventFromTask({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      alert('✅ Task synced to Google Calendar!');
    } catch (err) {
      alert('Failed to sync: ' + err.message);
    } finally {
      setSyncingTask(null);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // Move task to next status in workflow
  const moveToNextStatus = (task) => {
    const statusFlow = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
    const currentIndex = statusFlow.indexOf(task.status);
    
    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      updateTaskStatus(task.id, nextStatus);
    }
  };

  // Get next status label
  const getNextStatusLabel = (currentStatus) => {
    const statusLabels = {
      'BACKLOG': 'Move to To Do',
      'TODO': 'Start Progress',
      'IN_PROGRESS': 'Move to Review',
      'REVIEW': 'Mark as Done',
      'COMPLETED': 'Completed'
    };
    return statusLabels[currentStatus] || 'Next';
  };

  const columns = [
    { id: 'BACKLOG', title: 'Backlog', color: '#e5e7eb' },
    { id: 'TODO', title: 'To Do', color: '#3b82f6' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#f59e0b' },
    { id: 'REVIEW', title: 'Review', color: '#ec4899' },
    { id: 'COMPLETED', title: 'Done', color: '#10b981' },
  ];

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div className="projects">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Board</h1>
          <p className="page-subtitle">Manage your projects with Kanban-style boards</p>
        </div>
        <div className="header-actions">
          {projects.length > 0 ? (
            <select 
              className="project-select" 
              value={selectedProject?.id || ''} 
              onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value))}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          ) : (
            <button className="btn-primary" onClick={() => setShowAddProject(true)}>
              <Plus size={16} />
              Create Project
            </button>
          )}
          {selectedProject && (
            <button className="btn-secondary" onClick={() => setShowAddTask(true)}>
              <Plus size={16} />
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="kanban-column">
              <div className="column-header">
                <div className="column-title-wrapper">
                  <h3 className="column-title">{column.title}</h3>
                  <span className="column-count">{columnTasks.length}</span>
                </div>
              </div>

              <div className="column-content">
                {columnTasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <span className={`task-priority ${task.priority?.toLowerCase()}`}>
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
                        {task.dueDate && (
                          <span className="task-date">
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                      </div>
                      <div className="task-actions">
                        <button 
                          className="sync-btn" 
                          onClick={() => syncToCalendar(task)}
                          disabled={syncingTask === task.id}
                          title="Sync to Google Calendar"
                        >
                          {syncingTask === task.id ? <Loader size={12} className="spinner" /> : '📅'}
                        </button>
                        {task.status !== 'COMPLETED' && (
                          <button 
                            className="move-status-btn" 
                            onClick={() => moveToNextStatus(task)}
                            title={getNextStatusLabel(task.status)}
                          >
                            {task.status === 'REVIEW' ? <CheckCircle size={14} /> : <ArrowRight size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="modal-overlay" onClick={() => setShowAddProject(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button onClick={() => setShowAddProject(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="modal-input"
              />
              <textarea
                placeholder="Description (optional)"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="modal-textarea"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddProject(false)}>Cancel</button>
              <button className="btn-primary" onClick={createProject}>Create Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button onClick={() => setShowAddTask(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="modal-input"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="modal-textarea"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="modal-select"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="modal-input"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddTask(false)}>Cancel</button>
              <button className="btn-primary" onClick={createTask}>Create Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Notice */}
      <div className="integration-notice">
        <div className="notice-icon">
          <Sparkles size={24} />
        </div>
        <div className="notice-content">
          <h4 className="notice-title">Google Workspace Integration Active</h4>
          <p className="notice-text">
            Click 📅 on any task to sync it to Google Calendar. Tasks are saved to your database in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsNew;
