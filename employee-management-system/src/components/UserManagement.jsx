import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const { user, mockUsers } = useAuth();

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'manager': return 'role-manager';
      case 'employee': return 'role-employee';
      default: return 'role-employee';
    }
  };

  const canViewUser = (targetUser) => {
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && targetUser.role === 'employee') return true;
    return false;
  };

  const visibleUsers = mockUsers.filter(canViewUser);

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>User Management</h1>
        <p>Manage team members and their permissions</p>
      </div>

      <div className="user-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{visibleUsers.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>{visibleUsers.filter(u => u.role === 'employee').length}</h3>
            <p>Employees</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👔</div>
          <div className="stat-content">
            <h3>{visibleUsers.filter(u => u.role === 'manager').length}</h3>
            <p>Managers</p>
          </div>
        </div>
        
        {user.role === 'admin' && (
          <div className="stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-content">
              <h3>{visibleUsers.filter(u => u.role === 'admin').length}</h3>
              <p>Admins</p>
            </div>
          </div>
        )}
      </div>

      <div className="user-list-container">
        <div className="user-list-header">
          <h2>Team Members</h2>
          <button className="btn btn-primary" disabled>
            ➕ Add User
          </button>
        </div>

        <div className="user-grid">
          {visibleUsers.map((userItem) => (
            <div key={userItem.id} className="user-card">
              <div className="user-avatar-section">
                <img
                  src={userItem.avatar}
                  alt={userItem.name}
                  className="user-avatar"
                />
                <span className={`role-badge ${getRoleBadgeClass(userItem.role)}`}>
                  {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                </span>
              </div>
              
              <div className="user-info">
                <h3>{userItem.name}</h3>
                <p className="user-email">{userItem.email}</p>
                <p className="user-username">@{userItem.username}</p>
              </div>
              
              <div className="user-actions">
                <button className="btn btn-sm btn-outline" disabled>
                  ✏️ Edit
                </button>
                <button className="btn btn-sm btn-outline" disabled>
                  📧 Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {visibleUsers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users to display</h3>
            <p>You don't have permission to view any users or no users exist.</p>
          </div>
        )}
      </div>

      <div className="feature-notice">
        <div className="notice-card">
          <div className="notice-icon">🚧</div>
          <div className="notice-content">
            <h3>Coming Soon</h3>
            <p>
              Full user management features including adding, editing, and removing users 
              will be available in future updates. Currently, you can view team members 
              based on your role permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;