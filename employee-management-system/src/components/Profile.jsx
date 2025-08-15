import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    username: user.username
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      updateProfile(formData);
      setIsEditing(false);
      showSuccess('Profile updated successfully! 🎉');
    } catch (error) {
      showError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username
    });
    setIsEditing(false);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'manager': return 'role-manager';
      case 'employee': return 'role-employee';
      default: return 'role-employee';
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <img
              src={user.avatar}
              alt={user.name}
              className="profile-avatar"
            />
            <div className="avatar-info">
              <h2>{user.name}</h2>
              <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  disabled
                />
                <div className="form-help">
                  Your role is managed by administrators and cannot be changed.
                </div>
              </div>
            </div>

            <div className="form-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    💾 Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCancel}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="profile-stats">
          <h3>Quick Stats</h3>
          <div className="stats-list">
            <div className="stat-item">
              <div className="stat-icon">👤</div>
              <div className="stat-content">
                <span className="stat-label">Account Type</span>
                <span className="stat-value">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📧</div>
              <div className="stat-content">
                <span className="stat-label">Email Status</span>
                <span className="stat-value verified">Verified</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">🔐</div>
              <div className="stat-content">
                <span className="stat-label">Security</span>
                <span className="stat-value">Strong</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-security">
        <div className="security-card">
          <h3>Security Settings</h3>
          <p>Manage your account security and privacy settings</p>
          
          <div className="security-actions">
            <button className="btn btn-outline" disabled>
              🔒 Change Password
            </button>
            <button className="btn btn-outline" disabled>
              🔐 Two-Factor Authentication
            </button>
            <button className="btn btn-outline" disabled>
              📱 Manage Sessions
            </button>
          </div>
          
          <div className="security-note">
            <p>💡 Security features will be available in future updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;