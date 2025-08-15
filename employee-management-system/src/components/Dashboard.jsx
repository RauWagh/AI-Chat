import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, getMyTasks, getTaskStats } = useTask();
  const { showInfo } = useNotification();
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [myTasks, setMyTasks] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    // Welcome notification
    showInfo(`Welcome back, ${user.name}! 👋`);
  }, []);

  useEffect(() => {
    const taskStats = getTaskStats();
    setStats(taskStats);

    const userTasks = getMyTasks();
    setMyTasks(userTasks);

    // Get recent tasks (last 5 tasks)
    const recent = tasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
    setRecentTasks(recent);
  }, [tasks, user.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'status-todo';
      case 'In Progress': return 'status-in-progress';
      case 'Done': return 'status-done';
      default: return 'status-todo';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
      default: return 'priority-low';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOverdueTasks = () => {
    return myTasks.filter(task => {
      if (task.status === 'Done') return false;
      const daysUntil = getDaysUntilDeadline(task.deadline);
      return daysUntil < 0;
    });
  };

  const getUpcomingTasks = () => {
    return myTasks.filter(task => {
      if (task.status === 'Done') return false;
      const daysUntil = getDaysUntilDeadline(task.deadline);
      return daysUntil >= 0 && daysUntil <= 3;
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = (userId) => {
    // This would normally come from a users context/service
    const userMap = {
      1: 'Admin User',
      2: 'Manager User', 
      3: 'Employee User'
    };
    return userMap[userId] || 'Unknown User';
  };

  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {getGreeting()}, {user.name}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <div className="dashboard-actions">
          <Link to="/tasks" className="btn btn-primary">
            📋 View All Tasks
          </Link>
          {(user.role === 'admin' || user.role === 'manager') && (
            <Link to="/users" className="btn btn-outline">
              👥 Manage Users
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-icon">📊</div>
          <div className="stats-content">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        
        <div className="stats-card pending">
          <div className="stats-icon">📝</div>
          <div className="stats-content">
            <h3>{stats.todo}</h3>
            <p>To Do</p>
          </div>
        </div>
        
        <div className="stats-card progress">
          <div className="stats-icon">⚙️</div>
          <div className="stats-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        
        <div className="stats-card completed">
          <div className="stats-icon">✅</div>
          <div className="stats-content">
            <h3>{stats.done}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      {(overdueTasks.length > 0 || upcomingTasks.length > 0) && (
        <div className="alert-cards">
          {overdueTasks.length > 0 && (
            <div className="alert-card danger">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <h4>Overdue Tasks</h4>
                <p>You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} that need immediate attention.</p>
              </div>
              <Link to="/tasks" className="alert-action">
                View Tasks →
              </Link>
            </div>
          )}
          
          {upcomingTasks.length > 0 && (
            <div className="alert-card warning">
              <div className="alert-icon">📅</div>
              <div className="alert-content">
                <h4>Upcoming Deadlines</h4>
                <p>You have {upcomingTasks.length} task{upcomingTasks.length > 1 ? 's' : ''} due in the next 3 days.</p>
              </div>
              <Link to="/tasks" className="alert-action">
                View Tasks →
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="dashboard-content">
        {/* My Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Tasks</h2>
            <Link to="/tasks" className="section-link">View All</Link>
          </div>
          
          <div className="task-list">
            {myTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No tasks assigned</h3>
                <p>You don't have any tasks assigned to you yet.</p>
              </div>
            ) : (
              myTasks.slice(0, 5).map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="task-deadline">
                    <div className="deadline-date">{formatDate(task.deadline)}</div>
                    <div className="deadline-days">
                      {getDaysUntilDeadline(task.deadline) >= 0 
                        ? `${getDaysUntilDeadline(task.deadline)} days left`
                        : `${Math.abs(getDaysUntilDeadline(task.deadline))} days overdue`
                      }
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/tasks" className="section-link">View All</Link>
          </div>
          
          <div className="activity-list">
            {recentTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No recent activity</h3>
                <p>No recent task updates to show.</p>
              </div>
            ) : (
              recentTasks.map(task => (
                <div key={task.id} className="activity-item">
                  <div className="activity-icon">
                    {task.status === 'Done' ? '✅' : '📝'}
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>{task.title}</strong> was updated
                    </p>
                    <div className="activity-meta">
                      <span>Assigned to: {getUserName(task.assignedTo)}</span>
                      <span>•</span>
                      <span>Updated: {formatDate(task.updatedAt)}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/tasks" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Manage Tasks</h3>
            <p>View, create, and update your tasks</p>
          </Link>
          
          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>Update Profile</h3>
            <p>Edit your personal information</p>
          </Link>
          
          {(user.role === 'admin' || user.role === 'manager') && (
            <Link to="/users" className="action-card">
              <div className="action-icon">👥</div>
              <h3>User Management</h3>
              <p>Manage team members and permissions</p>
            </Link>
          )}
          
          <div className="action-card disabled">
            <div className="action-icon">📊</div>
            <h3>Reports</h3>
            <p>Coming soon - View detailed analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;