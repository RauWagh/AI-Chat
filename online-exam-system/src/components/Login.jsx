import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaGraduationCap, FaChalkboardTeacher, FaUserShield, FaEye } from 'react-icons/fa';
import '../styles/login.css';

const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const roles = [
    {
      id: 'student',
      name: 'Student',
      description: 'Take exams and view results',
      icon: FaGraduationCap
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'Create and manage exams',
      icon: FaChalkboardTeacher
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'System administration',
      icon: FaUserShield
    },
    {
      id: 'proctor',
      name: 'Proctor',
      description: 'Monitor exam sessions',
      icon: FaEye
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    clearError();
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    clearError();
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setMessage({ type: 'error', text: 'Please select a role to continue' });
      return;
    }

    if (!credentials.email || !credentials.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      const result = await login(credentials, selectedRole);
      if (result.success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Login failed' });
    }
  };

  const getThemeClass = () => {
    if (!selectedRole) return '';
    return `theme-${selectedRole}`;
  };

  return (
    <div className="login-container">
      <div className={`login-card ${getThemeClass()}`}>
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            E
          </div>
          <h1 className="login-title">Exam Portal</h1>
          <p className="login-subtitle">Secure Online Examination System</p>
        </div>

        {/* Body */}
        <div className="login-body">
          {/* Role Selection */}
          {!selectedRole && (
            <div className="role-selection">
              <h3>Select Your Role</h3>
              <div className="role-grid">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <div
                      key={role.id}
                      className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <div className="role-icon">
                        <IconComponent />
                      </div>
                      <div className="role-name">{role.name}</div>
                      <div className="role-description">{role.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Role Display */}
          {selectedRole && (
            <div className="role-selection">
              <h3>Login as {roles.find(r => r.id === selectedRole)?.name}</h3>
              <div className="role-grid">
                <div className="role-card selected">
                  {React.createElement(roles.find(r => r.id === selectedRole)?.icon)}
                  <div className="role-name">{roles.find(r => r.id === selectedRole)?.name}</div>
                  <div className="role-description">{roles.find(r => r.id === selectedRole)?.description}</div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedRole('')}
                >
                  Change Role
                </button>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {(error || message.text) && (
            <div className={`message message-${error ? 'error' : message.type}`}>
              {error || message.text}
            </div>
          )}

          {/* Login Form */}
          {selectedRole && (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Email Address"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
                />
                <FaUser className="input-icon" />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                />
                <FaLock className="input-icon" />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="login-footer">
          <a href="#" className="forgot-password">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;