import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OAuthCallback from './pages/OAuthCallback';
import GoogleApps from './pages/GoogleApps';
import AIInsights from './pages/AIInsights';
import Team from './pages/Team';
import Projects from './pages/ProjectsNew';
import Calendar from './pages/Calendar';
import IntegrationTest from './pages/IntegrationTest';
import './App.css';

const GOOGLE_CLIENT_ID = '435162604229-9ja5kvdm8tb9dh5udfvb3slg4rsfku5m.apps.googleusercontent.com';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/ai-insights" element={<AIInsights />} />
                      <Route path="/google-apps" element={<GoogleApps />} />
                      <Route path="/integration-test" element={<IntegrationTest />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
