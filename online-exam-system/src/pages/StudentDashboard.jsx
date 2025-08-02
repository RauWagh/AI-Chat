import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaClock, 
  FaPlay, 
  FaTrophy, 
  FaChartLine,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../styles/dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [examsData, resultsData] = await Promise.all([
        studentAPI.getExams(),
        studentAPI.getResults()
      ]);
      setExams(examsData);
      setResults(resultsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (examId) => {
    try {
      const result = await studentAPI.startExam(examId);
      if (result.success) {
        // In a real app, redirect to exam interface
        alert(`Exam started! Session ID: ${result.examSession}`);
        // Refresh data to update exam status
        loadDashboardData();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const examDate = new Date(`${exam.date} ${exam.time}`);
    
    if (exam.status === 'completed') return 'completed';
    if (examDate > now) return 'upcoming';
    if (examDate <= now && examDate.getTime() + (exam.duration * 60000) > now.getTime()) return 'active';
    return 'expired';
  };

  const canStartExam = (exam) => {
    const status = getExamStatus(exam);
    return status === 'active';
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

  const getGradeColor = (grade) => {
    const gradeMap = {
      'A+': '#10b981', 'A': '#10b981', 'A-': '#10b981',
      'B+': '#3b82f6', 'B': '#3b82f6', 'B-': '#3b82f6',
      'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#f59e0b',
      'D': '#ef4444', 'F': '#ef4444'
    };
    return gradeMap[grade] || '#6b7280';
  };

  const calculateAverageScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(total / results.length);
  };

  const tabs = [
    { id: 'exams', label: 'Exams', icon: FaFileAlt },
    { id: 'results', label: 'Results', icon: FaTrophy }
  ];

  if (loading) {
    return (
      <div className="dashboard theme-student">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-logo">E</div>
              <div className="header-info">
                <h1>Student Portal</h1>
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

  return (
    <div className="dashboard theme-student">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">E</div>
            <div className="header-info">
              <h1>Student Portal</h1>
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
                <p>{user?.studentId} • {user?.department}</p>
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
            <div className="stat-value">{exams.length}</div>
            <div className="stat-label">Total Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
            </div>
            <div className="stat-value">{results.length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaChartLine />
              </div>
            </div>
            <div className="stat-value">{calculateAverageScore()}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <FaHourglassHalf />
              </div>
            </div>
            <div className="stat-value">{exams.filter(e => getExamStatus(e) === 'upcoming').length}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'exams' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Available Exams</h2>
            </div>

            {exams.length === 0 ? (
              <div className="empty-state">
                <FaFileAlt className="empty-state-icon" />
                <h3>No Exams Available</h3>
                <p>There are currently no exams scheduled for you.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {exams.map(exam => {
                  const status = getExamStatus(exam);
                  return (
                    <div key={exam.id} className="content-card">
                      <div className="card-header">
                        <h3 className="card-title">{exam.title}</h3>
                        <p className="card-subtitle">{exam.subject}</p>
                      </div>
                      <div className="card-body">
                        <div className="flex items-center mb-4">
                          <FaCalendarAlt className="text-gray-400 mr-2" />
                          <span>{formatDate(exam.date)}</span>
                        </div>
                        <div className="flex items-center mb-4">
                          <FaClock className="text-gray-400 mr-2" />
                          <span>{formatTime(exam.time)} • {exam.duration} minutes</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`status-badge ${status}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <div></div>
                        <button
                          className={`btn ${canStartExam(exam) ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => canStartExam(exam) && handleStartExam(exam.id)}
                          disabled={!canStartExam(exam)}
                        >
                          {canStartExam(exam) ? (
                            <>
                              <FaPlay />
                              Start Exam
                            </>
                          ) : (
                            status === 'completed' ? 'Completed' :
                            status === 'upcoming' ? 'Not Started' : 'View Details'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Exam Results</h2>
            </div>

            {results.length === 0 ? (
              <div className="empty-state">
                <FaTrophy className="empty-state-icon" />
                <h3>No Results Available</h3>
                <p>Your exam results will appear here once you complete any exams.</p>
              </div>
            ) : (
              <div className="data-table">
                <div className="table-header">
                  <h3 className="table-title">Recent Results</h3>
                </div>
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Exam</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Completed</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(result => (
                        <tr key={result.id}>
                          <td>
                            <div>
                              <div className="font-medium">{result.examTitle}</div>
                            </div>
                          </td>
                          <td>
                            <div className="font-medium">
                              {result.score}/{result.maxScore}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.round((result.score / result.maxScore) * 100)}%
                            </div>
                          </td>
                          <td>
                            <span 
                              className="font-bold"
                              style={{color: getGradeColor(result.grade)}}
                            >
                              {result.grade}
                            </span>
                          </td>
                          <td>
                            {new Date(result.completedAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="text-sm text-gray-600">
                              {result.feedback || 'No feedback provided'}
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
    </div>
  );
};

export default StudentDashboard;