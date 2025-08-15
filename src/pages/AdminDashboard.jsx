import React, { useState, useEffect } from 'react'
import './AdminDashboard.css'

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: ''
  })

  // Mock data for users
  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@bitopark.com',
        role: 'manager',
        department: 'Engineering',
        status: 'active',
        joinDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@bitopark.com',
        role: 'employee',
        department: 'Marketing',
        status: 'active',
        joinDate: '2024-02-01'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@bitopark.com',
        role: 'employee',
        department: 'Sales',
        status: 'inactive',
        joinDate: '2024-01-20'
      }
    ])
  }, [])

  const handleAddUser = (e) => {
    e.preventDefault()
    const userToAdd = {
      id: Date.now(),
      ...newUser,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    }
    setUsers([...users, userToAdd])
    setNewUser({ name: '', email: '', role: 'employee', department: '' })
    setShowAddUser(false)
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const handleStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    managers: users.filter(u => u.role === 'manager').length,
    employees: users.filter(u => u.role === 'employee').length
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">{user.avatar}</div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-role">Administrator</p>
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
            <div className="stats-number">{stats.totalUsers}</div>
            <div className="stats-label">Total Users</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stats.activeUsers}</div>
            <div className="stats-label">Active Users</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stats.managers}</div>
            <div className="stats-label">Managers</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">{stats.employees}</div>
            <div className="stats-label">Employees</div>
          </div>
        </div>

        {/* User Management */}
        <div className="main-content">
          <div className="content-header">
            <h2 className="content-title">User Management</h2>
            <button 
              onClick={() => setShowAddUser(true)} 
              className="btn btn-primary"
            >
              Add New User
            </button>
          </div>
          
          <div className="content-body">
            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-text">No users found</div>
                <div className="empty-state-description">
                  Start by adding your first user to the system.
                </div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                            {user.name.charAt(0)}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge badge-${user.role === 'manager' ? 'warning' : 'info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`badge badge-${user.status === 'active' ? 'success' : 'danger'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.joinDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleStatusToggle(user.id)}
                            className={`btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button 
                onClick={() => setShowAddUser(false)}
                className="btn btn-sm btn-outline"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddUser(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard