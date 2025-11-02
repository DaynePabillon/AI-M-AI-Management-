import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Store the JWT token
      localStorage.setItem('jwt_token', token);
      console.log('Token saved:', token);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // No token, redirect to login
      console.error('No token found in OAuth callback');
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Completing sign in...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default OAuthCallback;
