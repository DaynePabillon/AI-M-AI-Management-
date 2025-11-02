import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../services/authService';
import { Cloud, Mail, Lock, User, Loader } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error);
        return;
      }
      
      // Supabase will handle the redirect
    } catch (error) {
      console.error('Error with Google login:', error);
      setError('Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        // Register with Supabase
        const { error } = await signUpWithEmail(
          formData.email,
          formData.password,
          formData.name
        );
        
        if (error) {
          setError(error);
          return;
        }
        
        alert('Registration successful! Please check your email to verify your account.');
        setIsRegister(false);
      } else {
        // Login with Supabase
        const { error } = await signInWithEmail(
          formData.email,
          formData.password
        );
        
        if (error) {
          setError(error);
          return;
        }
        
        // Auth context will handle the user state
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <Cloud size={48} />
            <h1>SkyFlow PM</h1>
            <p>Cloud Project Suite</p>
          </div>
          <div className="login-features">
            <h2>Manage Projects Smarter</h2>
            <ul>
              <li>✨ AI-Powered Insights</li>
              <li>📊 Real-time Analytics</li>
              <li>🔗 Google Workspace Integration</li>
              <li>👥 Team Collaboration</li>
              <li>📅 Smart Scheduling</li>
            </ul>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="login-subtitle">
              {isRegister 
                ? 'Sign up to start managing your projects' 
                : 'Sign in to continue to SkyFlow PM'}
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {isRegister && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? (
                  <>
                    <Loader size={18} className="spinner" />
                    {isRegister ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  isRegister ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="btn-google"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </svg>
              {loading ? 'Connecting...' : `Continue with Google`}
            </button>

            <div className="login-footer">
              {isRegister ? (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setIsRegister(false)} className="link-button">
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setIsRegister(true)} className="link-button">
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
