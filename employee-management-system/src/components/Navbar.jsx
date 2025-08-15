import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, getUnreadCount, markAsRead, clearAll } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/tasks', label: 'Tasks', icon: '📋' },
      { path: '/profile', label: 'Profile', icon: '👤' }
    ];

    if (user.role === 'admin' || user.role === 'manager') {
      baseItems.splice(2, 0, { path: '/users', label: 'Users', icon: '👥' });
    }

    return baseItems;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">Employee MS</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          {getMenuItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Notifications */}
          <div className="notification-container">
            <button
              className="notification-btn"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <span className="notification-icon">🔔</span>
              {getUnreadCount() > 0 && (
                <span className="notification-badge">{getUnreadCount()}</span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      className="clear-all-btn"
                      onClick={() => {
                        clearAll();
                        setIsNotificationOpen(false);
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <span className="no-notifications-icon">📭</span>
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <span className="notification-type-icon">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="notification-text">
                            <p>{notification.message}</p>
                            <span className="notification-time">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        {!notification.read && <div className="unread-dot"></div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu">
            <div className="user-info">
              <img
                src={user.avatar}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              🚪
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {getMenuItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-menu-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mobile-menu-icon">{item.icon}</span>
              <span className="mobile-menu-label">{item.label}</span>
            </Link>
          ))}
          <button
            className="mobile-logout-btn"
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
          >
            <span className="mobile-menu-icon">🚪</span>
            <span className="mobile-menu-label">Logout</span>
          </button>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Overlay for notifications */}
      {isNotificationOpen && (
        <div
          className="notification-overlay"
          onClick={() => setIsNotificationOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;