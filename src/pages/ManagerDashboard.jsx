import React, { useState, useEffect } from 'react'
import './ManagerDashboard.css'

const ManagerDashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    deadline: ''
  })

  // Mock data for tasks and employees
  useEffect(() => {
    setEmployees([
      { id: 1, name: 'Jane Smith', email: 'jane@bitopark.com', department: 'Marketing' },
      { id: 2, name: 'Mike Johnson', email: 'mike@bitopark.com', department: 'Sales' },
      { id: 3, name: 'Sarah Wilson', email: 'sarah@bitopark.com', department: 'Engineering' }
    ])

    setTasks([
      {
        id: 1,
        title: 'Website Redesign',
        description: 'Redesign the company website with modern UI/UX',
        assignedTo: 'Sarah Wilson',
        priority: 'high',
        status: 'in-progress',
        deadline: '2024-03-15',
        createdAt: '2024-02-01'
      },
      {
        id: 2,
        title: 'Marketing Campaign',
        description: 'Launch new product marketing campaign',
        assignedTo: 'Jane Smith',
        priority: 'medium',
        status: 'todo',
        deadline: '2024-03-20',
        createdAt: '2024-02-05'
      },
      {
        id: 3,
        title: 'Sales Report',
        description: 'Prepare monthly sales report and analysis',
        assignedTo: 'Mike Johnson',
        priority: 'low',
        status: 'done',
        deadline: '2024-02-28',
        createdAt: '2024-02-10'
      }
    ])
  }, [])

  const handleAddTask = (e) => {
    e.preventDefault()
    const taskToAdd = {
      id: Date.now(),
      ...newTask,
      status: 'todo',
      createdAt: new Date().toISOString().split('T')[0]
    }
    setTasks([...tasks, taskToAdd])
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' })
    setShowAddTask(false)
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
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

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    pendingTasks: tasks.filter(t => t.status === 'todo').length
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">Manager Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">{user.avatar}</div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-role">Manager</p>
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
            <div className="stats-label">Total Tasks</div>
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

        {/* Task Management */}
        <div className="main-content">
          <div className="content-header">
            <h2 className="content-title">Task Management</h2>
            <button 
              onClick={() => setShowAddTask(true)} 
              className="btn btn-primary"
            >
              Create New Task
            </button>
          </div>
          
          <div className="content-body">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-text">No tasks found</div>
                <div className="empty-state-description">
                  Start by creating your first task for your team.
                </div>
              </div>
            ) : (
              <div className="tasks-grid">
                {tasks.map(task => (
                  <div key={task.id} className="task-card">
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
                        <span className="task-label">Assigned to:</span>
                        <span className="task-value">{task.assignedTo}</span>
                      </div>
                      <div className="task-info">
                        <span className="task-label">Deadline:</span>
                        <span className="task-value">{task.deadline}</span>
                      </div>
                      <div className="task-info">
                        <span className="task-label">Created:</span>
                        <span className="task-value">{task.createdAt}</span>
                      </div>
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
                      
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Team Overview */}
        <div className="main-content" style={{ marginTop: '2rem' }}>
          <div className="content-header">
            <h2 className="content-title">Team Overview</h2>
          </div>
          
          <div className="content-body">
            <div className="team-grid">
              {employees.map(employee => (
                <div key={employee.id} className="employee-card">
                  <div className="employee-avatar">{employee.name.charAt(0)}</div>
                  <div className="employee-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-email">{employee.email}</p>
                    <p className="employee-department">{employee.department}</p>
                  </div>
                  <div className="employee-stats">
                    <div className="stat">
                      <span className="stat-number">
                        {tasks.filter(t => t.assignedTo === employee.name).length}
                      </span>
                      <span className="stat-label">Tasks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Task</h3>
              <button 
                onClick={() => setShowAddTask(false)}
                className="btn btn-sm btn-outline"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select
                  className="form-select"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} - {emp.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddTask(false)} className="btn btn-secondary">
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
    </div>
  )
}

export default ManagerDashboard