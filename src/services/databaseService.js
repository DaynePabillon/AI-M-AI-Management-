import { supabase } from '../lib/supabaseClient';

/**
 * Database Service
 * Handles all database operations with Supabase
 */

// ==================== PROJECTS ====================

export const getProjects = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`owner_id.eq.${userId},members.cs.{${userId}}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { data: null, error: error.message };
  }
};

export const getProjectById = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { data: null, error: error.message };
  }
};

export const createProject = async (projectData) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating project:', error);
    return { data: null, error: error.message };
  }
};

export const updateProject = async (projectId, updates) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating project:', error);
    return { data: null, error: error.message };
  }
};

export const deleteProject = async (projectId) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { error: error.message };
  }
};

// ==================== TASKS ====================

export const getTasks = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { data: null, error: error.message };
  }
};

export const getTaskById = async (taskId) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching task:', error);
    return { data: null, error: error.message };
  }
};

export const createTask = async (taskData) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating task:', error);
    return { data: null, error: error.message };
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating task:', error);
    return { data: null, error: error.message };
  }
};

export const deleteTask = async (taskId) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { error: error.message };
  }
};

// ==================== TEAM MEMBERS ====================

export const getTeamMembers = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*, users(*)')
      .eq('project_id', projectId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching team members:', error);
    return { data: null, error: error.message };
  }
};

export const addTeamMember = async (memberData) => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert([memberData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding team member:', error);
    return { data: null, error: error.message };
  }
};

export const removeTeamMember = async (memberId) => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error removing team member:', error);
    return { error: error.message };
  }
};

// ==================== USER PROFILES ====================

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error: error.message };
  }
};

export const createUserProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error: error.message };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error: error.message };
  }
};

// ==================== CALENDAR EVENTS ====================

export const getCalendarEvents = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return { data: null, error: error.message };
  }
};

export const createCalendarEvent = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return { data: null, error: error.message };
  }
};

// ==================== REAL-TIME SUBSCRIPTIONS ====================

export const subscribeToProjects = (userId, callback) => {
  return supabase
    .channel('projects')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `owner_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToTasks = (projectId, callback) => {
  return supabase
    .channel('tasks')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      },
      callback
    )
    .subscribe();
};
