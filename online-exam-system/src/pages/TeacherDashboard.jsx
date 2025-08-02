import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { teacherAPI } from '../services/api';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaChalkboardTeacher, 
  FaFileAlt,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaTimes,
  FaExclamationTriangle,
  FaChartBar
} from 'react-icons/fa';
import '../styles/dashboard.css';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examForm, setExamForm] = useState({
    title: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const examsData = await teacherAPI.getExams();
      setExams(examsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (examId) => {
    try {
      const submissionsData = await teacherAPI.getSubmissions(examId);
      setSubmissions(submissionsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const newExam = await teacherAPI.createExam(examForm);
      setExams([...exams, newExam]);
      setShowCreateModal(false);
      setExamForm({
        title: '',
        subject: '',
        date: '',
        time: '',
        duration: '',
        description: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await teacherAPI.deleteExam(examId);
        setExams(exams.filter(exam => exam.id !== examId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleViewSubmissions = async (exam) => {
    setSelectedExam(exam);
    await loadSubmissions(exam.id);
    setActiveTab('submissions');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExamStats = () => {
    const total = exams.length;
    const draft = exams.filter(e => e.status === 'draft').length;
    const published = exams.filter(e => e.status === 'published').length;
    const completed = exams.filter(e => e.status === 'completed').length;

    return { total, draft, published, completed };
  };

  const tabs = [
    { id: 'exams', label: 'Manage Exams', icon: FaFileAlt },
    { id: 'submissions', label: 'View Submissions', icon: FaUsers }
  ];

  if (loading) {
    return (
      <div className="dashboard theme-teacher">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-logo">E</div>
              <div className="header-info">
                <h1>Teacher Portal</h1>
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

  const stats = getExamStats();

  return (
    <div className="dashboard theme-teacher">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">E</div>
            <div className="header-info">
              <h1>Teacher Portal</h1>
              <p>Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{user?.name}</h3>
                <p>{user?.teacherId} • {user?.department}</p>
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

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaFileAlt />
              </div>
            </div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaClock />
              </div>
            </div>
            <div className="stat-value">{stats.draft}</div>
            <div className="stat-label">Draft</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
            </div>
            <div className="stat-value">{stats.published}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaChartBar />
              </div>
            </div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'exams' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Exam Management</h2>
              <div className="section-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <FaPlus />
                  Create New Exam
                </button>
              </div>
            </div>

            {exams.length === 0 ? (
              <div className="empty-state">
                <FaFileAlt className="empty-state-icon" />
                <h3>No Exams Created</h3>
                <p>Start by creating your first exam using the button above.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <FaPlus />
                  Create Exam
                </button>
              </div>
            ) : (
              <div className="data-table">
                <div className="table-header">
                  <h3 className="table-title">Your Exams</h3>
                </div>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Exam Title</th>
                        <th>Subject</th>
                        <th>Date & Time</th>
                        <th>Duration</th>
                        <th>Students</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map(exam => (
                        <tr key={exam.id}>
                          <td>
                            <div className="font-medium">{exam.title}</div>
                          </td>
                          <td>{exam.subject}</td>
                          <td>
                            <div>{formatDate(exam.date)}</div>
                            <div className="text-sm text-gray-500">{formatTime(exam.time)}</div>
                          </td>
                          <td>{exam.duration} min</td>
                          <td>
                            <div className="font-medium">{exam.studentsCount}</div>
                            <div className="text-sm text-gray-500">
                              {exam.submissionsCount} submitted
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${exam.status}`}>
                              {exam.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleViewSubmissions(exam)}
                                title="View Submissions"
                              >
                                <FaEye />
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                title="Edit Exam"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteExam(exam.id)}
                                title="Delete Exam"
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
            )}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                {selectedExam ? `Submissions for ${selectedExam.title}` : 'Exam Submissions'}
              </h2>
              {selectedExam && (
                <div className="section-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setActiveTab('exams');
                      setSelectedExam(null);
                      setSubmissions([]);
                    }}
                  >
                    Back to Exams
                  </button>
                </div>
              )}
            </div>

            {!selectedExam ? (
              <div className="empty-state">
                <FaUsers className="empty-state-icon" />
                <h3>Select an Exam</h3>
                <p>Choose an exam from the "Manage Exams" tab to view its submissions.</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="empty-state">
                <FaUsers className="empty-state-icon" />
                <h3>No Submissions Yet</h3>
                <p>Students haven't submitted their exams yet.</p>
              </div>
            ) : (
              <div className="data-table">
                <div className="table-header">
                  <h3 className="table-title">Student Submissions</h3>
                </div>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Submitted At</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map(submission => (
                        <tr key={submission.id}>
                          <td>
                            <div className="font-medium">{submission.studentName}</div>
                            <div className="text-sm text-gray-500">ID: {submission.studentId}</div>
                          </td>
                          <td>
                            {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td>
                            {submission.score !== undefined ? (
                              <div className="font-medium">{submission.score}%</div>
                            ) : (
                              <span className="text-gray-500">Not graded</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${submission.status}`}>
                              {submission.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn btn-sm btn-primary"
                                title="Grade Submission"
                              >
                                Grade
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                title="View Details"
                              >
                                <FaEye />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Create New Exam</h2>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateExam}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Exam Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={examForm.title}
                    onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    value={examForm.subject}
                    onChange={(e) => setExamForm({...examForm, subject: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2" style={{gap: 'var(--spacing-4)'}}>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={examForm.date}
                      onChange={(e) => setExamForm({...examForm, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={examForm.time}
                      onChange={(e) => setExamForm({...examForm, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={examForm.duration}
                    onChange={(e) => setExamForm({...examForm, duration: e.target.value})}
                    min="15"
                    max="300"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={examForm.description}
                    onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                    placeholder="Enter exam description..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;