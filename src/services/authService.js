/**
 * Authentication Service
 * Handles all authentication-related operations with Local Backend
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Helper to store JWT token
const setToken = (token) => {
  localStorage.setItem('jwt_token', token);
};

const getToken = () => {
  return localStorage.getItem('jwt_token');
};

const removeToken = () => {
  localStorage.removeItem('jwt_token');
};

// Helper to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  return fetch(url, { ...options, headers });
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, fullName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    if (data.token) {
      setToken(data.token);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (data.token) {
      setToken(data.token);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error: error.message };
  }
};

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  try {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    return { data: { url: `${API_BASE_URL}/oauth2/authorization/google` }, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { data: null, error: error.message };
  }
};

// Sign out
export const signOut = async () => {
  try {
    removeToken();
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error.message };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { user: null, error: 'No token found' };
    }
    
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user');
    }
    
    // Backend returns { success: true, message: "...", data: User }
    return { user: data.data, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error: error.message };
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { session: null, error: null };
    }
    
    const user = await getCurrentUser();
    const session = user.user ? { user: user.user, access_token: token } : null;
    
    return { session, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error: error.message };
  }
};

// Listen to auth state changes (simplified for local backend)
export const onAuthStateChange = (callback) => {
  // For local backend, we'll check token on mount
  const checkAuth = async () => {
    const { session } = await getCurrentSession();
    callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
  };
  
  checkAuth();
  
  // Return unsubscribe function
  return { data: { subscription: { unsubscribe: () => {} } } };
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Update failed');
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Reset failed');
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { data: null, error: error.message };
  }
};

// Update password
export const updatePassword = async (newPassword) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Password update failed');
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { data: null, error: error.message };
  }
};
