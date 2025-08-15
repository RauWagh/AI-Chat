import React, { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  })
  const [errors, setErrors] = useState({})

  const roles = [
    {
      id: 'admin',
      label: 'Admin',
      icon: '👑',
      description: 'Manage users and system settings'
    },
    {
      id: 'manager',
      label: 'Manager',
      icon: '📊',
      description: 'Assign tasks and track progress'
    },
    {
      id: 'employee',
      label: 'Employee',
      icon: '👤',
      description: 'View and update own tasks'
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleRoleSelect = (roleId) => {
    setFormData(prev => ({
      ...prev,
      role: roleId
    }))
    
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Simulate authentication
      const userData = {
        id: Date.now(),
        email: formData.email,
        name: formData.email.split('@')[0],
        role: formData.role,
        avatar: formData.email.charAt(0).toUpperCase()
      }
      
      onLogin(userData)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <h1>🚀</h1>
        </div>
        
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">
          Employee Management System - BITOPARK TECHNOLOGIES
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Select Your Role</label>
            <div className="role-selector">
              {roles.map(role => (
                <div
                  key={role.id}
                  className={`role-option ${formData.role === role.id ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="role-icon">{role.icon}</div>
                  <div className="role-label">{role.label}</div>
                  <div className="role-description">{role.description}</div>
                </div>
              ))}
            </div>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>
        
        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p><strong>Email:</strong> admin@bitopark.com | <strong>Password:</strong> 123456</p>
          <p><strong>Email:</strong> manager@bitopark.com | <strong>Password:</strong> 123456</p>
          <p><strong>Email:</strong> employee@bitopark.com | <strong>Password:</strong> 123456</p>
        </div>
      </div>
    </div>
  )
}

export default Login