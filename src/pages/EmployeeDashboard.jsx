import React, { useState, useEffect } from 'react'
import './EmployeeDashboard.css'

const EmployeeDashboard = ({ user, onLogout }) => {
  const [myTasks, setMyTasks] = useState([])
  const [filter, setFilter] = useState('all')

  // Mock data for employee tasks
  useEffect(() => {
    setMyTasks([
      {
        id: 1,
        title: 'Complete Website Redesign',
        description: 'Redesign the company website with modern UI/UX principles and responsive design',
        priority: 'high',
        status: 'in-progress',
        deadline: '2024-03-15',
        assignedBy: 'Manager',
        createdAt: '2024-02-01',
        progress: 65
      },
      {
        id: 2,
        title: 'Update Documentation',
        description: 'Update technical documentation for the new API endpoints',
        priority: 'medium',
        status: 'todo',
        deadline: '2024-03-20',
        assignedBy: 'Manager',
        createdAt: '2024-02-05',
        progress: 0
      },
      {
        id: 3,
        title: 'Code Review',
        description: 'Review pull requests for the authentication module',
        priority: 'low',
        status: 'done',
        deadline: '2024-02-28',
        assignedBy: 'Manager',
        createdAt: '2024-02-10',
        progress: 100
      },
      {
        id: 4,
        title: 'Bug Fixes',
        description: 'Fix reported bugs in the user dashboard',
        priority: 'high',
        status: 'todo',
        deadline: '2024-03-10',
        assignedBy: 'Manager',
        createdAt: '2024-02-15',
        progress: 0
      }
    ])
  }, [])

  const handleStatusChange = (taskId, newStatus) => {
    setMyTasks(myTasks.map(task => {
      if (task.id === taskId) {
        let progress = task.progress
        if (newStatus === 'todo') progress = 0
        else if (newStatus === 'in-progress') progress = 50
        else if (newStatus === 'done') progress = 100
        
        return { ...task, status: newStatus, progress }
      }
      return task
    }))
  }

  const handleProgressChange = (taskId, newProgress) => {
    setMyTasks(myTasks.map(task => 
      task.id === taskId ? { ...task, progress: newProgress } : task
    ))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'info'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'info'
      case 'in-progress': return 'warning'
      case 'done': return 'success'
      default: return 'secondary'
    }
  }

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const stats = {
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t => t.status === 'done').length,
    inProgressTasks: myTasks.filter(t => t.status === 'in-progress').length,
    pendingTasks: myTasks.filter(t => t.status === 'todo').length
  }

  const overdueTasks = myTasks.filter(task => {
    const deadline = new Date(task.deadline)
    const today = new Date()
    return deadline < today && task.status !== 'done'
  })

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">Employee Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">{user.avatar}</div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-role">Employee</p>
            </div>
            <button onClick={onLogout} className="btn btn-outline">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats Cards */}
        <div className="dashboard-content">
          <div className="stats-card">
            <div className="stats-number">{stats.totalTasks}</div>
            <div className="stats-label">My Tasks</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stats.completedTasks}</div>
            <div className="stats-label">Completed</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stats.inProgressTasks}</div>
            <div className="stats-label">In Progress</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stats.pendingTasks}</div>
            <div className="stats-label">Pending</div>
          </div>
        </div>

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <div className="alert alert-warning">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <h3>Overdue Tasks</h3>
              <p>You have {overdueTasks.length} task(s) that are past their deadline.</p>
            </div>
          </div>
        )}

        {/* Task Management */}
        <div className="main-content">
          <div className="content-header">
            <h2 className="content-title">My Tasks</h2>
            <div className="filter-buttons">
              <button 
                onClick={() => setFilter('all')}
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              >
                All ({stats.totalTasks})
              </button>
              <button 
                onClick={() => setFilter('todo')}
                className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
              >
                To Do ({stats.pendingTasks})
              </button>
              <button 
                onClick={() => setFilter('in-progress')}
                className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
              >
                In Progress ({stats.inProgressTasks})
              </button>
              <button 
                onClick={() => setFilter('done')}
                className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
              >
                Done ({stats.completedTasks})
              </button>
            </div>
          </div>
          
          <div className="content-body">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-text">No tasks found</div>
                <div className="empty-state-description">
                  {filter === 'all' 
                    ? "You don't have any tasks assigned yet." 
                    : `No ${filter.replace('-', ' ')} tasks found.`
                  }
                </div>
              </div>
            ) : (
              <div className="tasks-grid">
                {filteredTasks.map(task => (
                  <div key={task.id} className={`task-card ${task.deadline < new Date().toISOString().split('T')[0] && task.status !== 'done' ? 'overdue' : ''}`}>
                    <div className="task-header">
                      <h3 className="task-title">{task.title}</h3>
                      <div className="task-priority">
                        <span className={`badge badge-${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    <p className="task-description">{task.description}</p>
                    
                    <div className="task-details">
                      <div className="task-info">
                        <span className="task-label">Assigned by:</span>
                        <span className="task-value">{task.assignedBy}</span>
                      </div>
                      <div className="task-info">
                        <span className="task-label">Deadline:</span>
                        <span className={`task-value ${task.deadline < new Date().toISOString().split('T')[0] && task.status !== 'done' ? 'overdue' : ''}`}>
                          {task.deadline}
                        </span>
                      </div>
                      <div className="task-info">
                        <span className="task-label">Created:</span>
                        <span className="task-value">{task.createdAt}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-section">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-percentage">{task.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress}
                        onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                        className="progress-slider"
                      />
                    </div>
                    
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`status-select status-${task.status}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="main-content" style={{ marginTop: '2rem' }}>
          <div className="content-header">
            <h2 className="content-title">Performance Summary</h2>
          </div>
          
          <div className="content-body">
            <div className="performance-grid">
              <div className="performance-card">
                <div className="performance-icon">📈</div>
                <div className="performance-info">
                  <h3>Completion Rate</h3>
                  <p className="performance-value">
                    {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              <div className="performance-card">
                <div className="performance-icon">⏰</div>
                <div className="performance-info">
                  <h3>On-Time Delivery</h3>
                  <p className="performance-value">
                    {stats.totalTasks > 0 ? Math.round(((stats.totalTasks - overdueTasks.length) / stats.totalTasks) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              <div className="performance-card">
                <div className="performance-icon">🎯</div>
                <div className="performance-info">
                  <h3>Active Tasks</h3>
                  <p className="performance-value">{stats.inProgressTasks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard