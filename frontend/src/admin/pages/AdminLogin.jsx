import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Invalid username or password.'
        );
      }

      // Keep tokens for this browser session.
      sessionStorage.setItem('access_token', data.access);
      sessionStorage.setItem('refresh_token', data.refresh);

      navigate('/admin');

    } catch (err) {
      setError(
        err.message || 'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">

        <div className="admin-login-brand">
          <div className="admin-brand-logo">
            <img src="/soccodo_logo.png" alt="SOCCODO Logo" />
          </div>
          <h2>SOCCODO</h2>
          <p>Administration Portal</p>
        </div>

        <div className="admin-login-heading">
          <h1>Welcome Back</h1>
          <p>Sign in to manage your organization's content.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>

            <div className="admin-password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <div className="admin-login-footer">
          <p>Authorized administration access only.</p>
          <span>© {new Date().getFullYear()} SOCCODO</span>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
