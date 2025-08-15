import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/TaskManagement.css';

const TaskManagement = () => {
  const { user, mockUsers } = useAuth();
  const { tasks, createTask, updateTask, deleteTask } = useTask();
  const { showSuccess, showError } = useNotification();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignedTo: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    deadline: ''
  });

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Medium',
      deadline: ''
    });
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.deadline) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      createTask({
        ...newTask,
        assignedTo: parseInt(newTask.assignedTo)
      });
      
      setShowCreateModal(false);
      resetNewTask();
      showSuccess('Task created successfully! 🎉');
    } catch (error) {
      showError('Failed to create task. Please try again.');
    }
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    
    try {
      updateTask(selectedTask.id, {
        ...selectedTask,
        assignedTo: parseInt(selectedTask.assignedTo)
      });
      
      setShowEditModal(false);
      setSelectedTask(null);
      showSuccess('Task updated successfully! ✅');
    } catch (error) {
      showError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        deleteTask(taskId);
        showSuccess('Task deleted successfully! 🗑️');
      } catch (error) {
        showError('Failed to delete task. Please try again.');
      }
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    try {
      updateTask(taskId, { status: newStatus });
      showSuccess(`Task status updated to ${newStatus}! 📝`);
    } catch (error) {
      showError('Failed to update task status. Please try again.');
    }
  };

  const openEditModal = (task) => {
    setSelectedTask({ ...task });
    setShowEditModal(true);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by user role and permissions
    if (user.role === 'employee') {
      filtered = filtered.filter(task => task.assignedTo === user.id);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply assigned to filter
    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(task => task.assignedTo === parseInt(filters.assignedTo));
    }

    return filtered;
  };

  const getUserName = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

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

  const canEditTask = (task) => {
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && task.assignedBy === user.id) return true;
    if (user.role === 'employee' && task.assignedTo === user.id) return true;
    return false;
  };

  const canDeleteTask = (task) => {
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && task.assignedBy === user.id) return true;
    return false;
  };

  const getAvailableUsers = () => {
    if (user.role === 'admin') return mockUsers;
    if (user.role === 'manager') return mockUsers.filter(u => u.role === 'employee');
    return [user];
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-management">
      {/* Header */}
      <div className="task-header">
        <div>
          <h1>Task Management</h1>
          <p>Create, assign, and track tasks across your team</p>
        </div>
        {(user.role === 'admin' || user.role === 'manager') && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Create Task
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="task-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="form-control form-select"
          >
            <option value="all">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="form-control form-select"
          >
            <option value="all">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {(user.role === 'admin' || user.role === 'manager') && (
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="form-control form-select"
            >
              <option value="all">All Users</option>
              {getAvailableUsers().map(userItem => (
                <option key={userItem.id} value={userItem.id}>
                  {userItem.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Task Stats */}
      <div className="task-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredTasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredTasks.filter(t => t.status === 'To Do').length}</span>
          <span className="stat-label">To Do</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredTasks.filter(t => t.status === 'In Progress').length}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredTasks.filter(t => t.status === 'Done').length}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>
              {searchTerm || filters.status !== 'all' || filters.priority !== 'all' || filters.assignedTo !== 'all'
                ? 'Try adjusting your filters or search term.'
                : 'No tasks have been created yet.'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-content">
                <div className="task-header-info">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-badges">
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-meta">
                  <div className="task-assignee">
                    <span className="meta-label">Assigned to:</span>
                    <span className="meta-value">{getUserName(task.assignedTo)}</span>
                  </div>
                  <div className="task-deadline">
                    <span className="meta-label">Due:</span>
                    <span className="meta-value">{formatDate(task.deadline)}</span>
                    <span className={`deadline-indicator ${getDaysUntilDeadline(task.deadline) < 0 ? 'overdue' : getDaysUntilDeadline(task.deadline) <= 3 ? 'urgent' : ''}`}>
                      {getDaysUntilDeadline(task.deadline) >= 0 
                        ? `${getDaysUntilDeadline(task.deadline)} days left`
                        : `${Math.abs(getDaysUntilDeadline(task.deadline))} days overdue`
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="task-actions">
                {canEditTask(task) && task.status !== 'Done' && (
                  <div className="status-controls">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                )}
                
                <div className="action-buttons">
                  {canEditTask(task) && (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openEditModal(task)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                  {canDeleteTask(task) && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create New Task</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  resetNewTask();
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control form-textarea"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Assign to *</label>
                  <select
                    className="form-control form-select"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                    required
                  >
                    <option value="">Select user...</option>
                    {getAvailableUsers().map(userItem => (
                      <option key={userItem.id} value={userItem.id}>
                        {userItem.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control form-select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deadline *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetNewTask();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Task</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTask(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditTask} className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control form-textarea"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Assign to *</label>
                  <select
                    className="form-control form-select"
                    value={selectedTask.assignedTo}
                    onChange={(e) => setSelectedTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                    required
                    disabled={user.role === 'employee'}
                  >
                    {getAvailableUsers().map(userItem => (
                      <option key={userItem.id} value={userItem.id}>
                        {userItem.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control form-select"
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask(prev => ({ ...prev, priority: e.target.value }))}
                    disabled={user.role === 'employee'}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control form-select"
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Deadline *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedTask.deadline}
                    onChange={(e) => setSelectedTask(prev => ({ ...prev, deadline: e.target.value }))}
                    required
                    disabled={user.role === 'employee'}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTask(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;