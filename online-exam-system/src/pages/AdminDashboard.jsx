import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { 
  FaUserShield, 
  FaUsers, 
  FaPlus,
  FaEdit, 
  FaTrash, 
  FaFileAlt,
  FaChartBar,
  FaDownload,
  FaTimes,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaCog,
  FaDatabase
} from 'react-icons/fa';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    department: '',
    password: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getSystemStats()
      ]);
      setUsers(usersData);
      setSystemStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const newUser = await adminAPI.createUser(userForm);
      setUsers([...users, newUser]);
      setShowCreateUserModal(false);
      resetUserForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      const result = await adminAPI.generateReport(reportType, {});
      if (result.success) {
        // In a real app, this would trigger a download
        alert(`Report generated! Report ID: ${result.reportId}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'student',
      department: '',
      password: ''
    });
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getUserStats = () => {
    const total = users.length;
    const students = users.filter(u => u.role === 'student').length;
    const teachers = users.filter(u => u.role === 'teacher').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const proctors = users.filter(u => u.role === 'proctor').length;

    return { total, students, teachers, admins, proctors };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'reports', label: 'Reports', icon: FaChartBar }
  ];

  if (loading) {
    return (
      <div className="dashboard theme-admin">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-logo">E</div>
              <div className="header-info">
                <h1>Admin Portal</h1>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-main">
          <div className="text-center">
            <div className="spinner" style={{width: '40px', height: '40px'}}></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const userStats = getUserStats();

  return (
    <div className="dashboard theme-admin">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">E</div>
            <div className="header-info">
              <h1>Admin Portal</h1>
              <p>System Administration Dashboard</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{user?.name}</h3>
                <p>{user?.adminId} • Administrator</p>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="dashboard-nav">
        <div className="nav-content">
          <ul className="nav-tabs">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <li
                  key={tab.id}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="tab-icon" />
                  {tab.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {error && (
          <div className="alert alert-error">
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        {/* System Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaUsers />
              </div>
            </div>
            <div className="stat-value">{systemStats.totalUsers || userStats.total}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaFileAlt />
              </div>
            </div>
            <div className="stat-value">{systemStats.totalExams || 0}</div>
            <div className="stat-label">Total Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaCog />
              </div>
            </div>
            <div className="stat-value">{systemStats.activeExams || 0}</div>
            <div className="stat-label">Active Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaDatabase />
              </div>
            </div>
            <div className="stat-value">{systemStats.totalSubmissions || 0}</div>
            <div className="stat-label">Submissions</div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'users' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">User Management</h2>
              <div className="section-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateUserModal(true)}
                >
                  <FaPlus />
                  Add User
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
              <div className="stat-card">
                <div className="stat-value">{userStats.students}</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{userStats.teachers}</div>
                <div className="stat-label">Teachers</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{userStats.admins}</div>
                <div className="stat-label">Administrators</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{userStats.proctors}</div>
                <div className="stat-label">Proctors</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="content-card" style={{marginBottom: 'var(--spacing-6)'}}>
              <div className="card-body">
                <div className="grid grid-cols-2" style={{gap: 'var(--spacing-4)'}}>
                  <div className="form-group" style={{marginBottom: 0}}>
                    <div style={{position: 'relative'}}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{paddingLeft: 'var(--spacing-10)'}}
                      />
                      <FaSearch style={{
                        position: 'absolute',
                        left: 'var(--spacing-3)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--gray-400)'
                      }} />
                    </div>
                  </div>
                  <div className="form-group" style={{marginBottom: 0}}>
                    <select
                      className="form-select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Students</option>
                      <option value="teacher">Teachers</option>
                      <option value="admin">Administrators</option>
                      <option value="proctor">Proctors</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="data-table">
              <div className="table-header">
                <h3 className="table-title">System Users</h3>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="font-medium">{user.name}</div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.department}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${user.status}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="btn btn-sm btn-secondary"
                              title="Edit User"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">System Reports</h2>
            </div>

            <div className="cards-grid">
              <div className="content-card">
                <div className="card-header">
                  <h3 className="card-title">User Activity Report</h3>
                  <p className="card-subtitle">Comprehensive user activity and engagement metrics</p>
                </div>
                <div className="card-body">
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Login/logout patterns</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Exam participation rates</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• User engagement metrics</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <div></div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleGenerateReport('user-activity')}
                  >
                    <FaDownload />
                    Generate
                  </button>
                </div>
              </div>

              <div className="content-card">
                <div className="card-header">
                  <h3 className="card-title">Exam Statistics</h3>
                  <p className="card-subtitle">Detailed exam performance and analytics</p>
                </div>
                <div className="card-body">
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Exam completion rates</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Average scores by subject</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Performance trends</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <div></div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleGenerateReport('exam-statistics')}
                  >
                    <FaDownload />
                    Generate
                  </button>
                </div>
              </div>

              <div className="content-card">
                <div className="card-header">
                  <h3 className="card-title">System Usage</h3>
                  <p className="card-subtitle">Platform usage statistics and system health</p>
                </div>
                <div className="card-body">
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Daily/weekly usage patterns</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Peak usage times</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• System performance metrics</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <div></div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleGenerateReport('system-usage')}
                  >
                    <FaDownload />
                    Generate
                  </button>
                </div>
              </div>

              <div className="content-card">
                <div className="card-header">
                  <h3 className="card-title">Security Report</h3>
                  <p className="card-subtitle">Security incidents and monitoring data</p>
                </div>
                <div className="card-body">
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Failed login attempts</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Suspicious activities</li>
                    <li style={{marginBottom: 'var(--spacing-2)'}}>• Access control violations</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <div></div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleGenerateReport('security')}
                  >
                    <FaDownload />
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Add New User</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowCreateUserModal(false);
                  resetUserForm();
                }}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2" style={{gap: 'var(--spacing-4)'}}>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                      <option value="proctor">Proctor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-input"
                      value={userForm.department}
                      onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    placeholder="User will be required to change on first login"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateUserModal(false);
                    resetUserForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;