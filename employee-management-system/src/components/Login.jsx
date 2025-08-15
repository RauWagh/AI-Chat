import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(credentials.username, credentials.password);
      
      if (result.success) {
        showSuccess('Welcome! Login successful.');
      } else {
        showError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Admin', username: 'admin', password: 'admin123' },
    { role: 'Manager', username: 'manager', password: 'manager123' },
    { role: 'Employee', username: 'employee', password: 'employee123' }
  ];

  const fillDemoCredentials = (username, password) => {
    setCredentials({ username, password });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="company-logo">
            <div className="logo-icon">📊</div>
            <h1>Employee Management</h1>
          </div>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-container">
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
              <div className="input-icon">👤</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-control"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn-login ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="login-spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="demo-accounts">
          <p className="demo-title">Demo Accounts:</p>
          <div className="demo-grid">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                className="demo-account-btn"
                onClick={() => fillDemoCredentials(account.username, account.password)}
                disabled={loading}
              >
                <div className="demo-role">{account.role}</div>
                <div className="demo-credentials">
                  {account.username} / {account.password}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <p className="login-info">
            This is a demo application showcasing employee management features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;