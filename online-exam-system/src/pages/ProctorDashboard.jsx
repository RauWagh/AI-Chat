import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { proctorAPI } from '../services/api';
import { 
  FaEye, 
  FaVideo,
  FaFlag,
  FaExclamationTriangle,
  FaStop,
  FaExpand,
  FaCompress,
  FaClock,
  FaUsers,
  FaShieldAlt,
  FaHistory,
  FaPlay,
  FaPause
} from 'react-icons/fa';
import '../styles/dashboard.css';
import '../styles/proctor.css';

const ProctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('monitor');
  const [activeExams, setActiveExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examStudents, setExamStudents] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fullscreenStudent, setFullscreenStudent] = useState(null);
  const [examTimer, setExamTimer] = useState('00:00:00');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      loadExamStudents(selectedExam.id);
      loadActivityLogs(selectedExam.id);
      
      // Start timer for selected exam
      const timer = setInterval(() => {
        updateExamTimer();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedExam]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const examsData = await proctorAPI.getActiveExams();
      setActiveExams(examsData);
      if (examsData.length > 0) {
        setSelectedExam(examsData[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadExamStudents = async (examId) => {
    try {
      const studentsData = await proctorAPI.getExamStudents(examId);
      setExamStudents(studentsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadActivityLogs = async (examId) => {
    try {
      const logsData = await proctorAPI.getActivityLogs(examId);
      setActivityLogs(logsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateExamTimer = () => {
    if (selectedExam) {
      const now = new Date();
      const startTime = new Date(selectedExam.startTime);
      const endTime = new Date(selectedExam.endTime);
      
      if (now < endTime) {
        const remaining = endTime - now;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setExamTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setExamTimer('00:00:00');
      }
    }
  };

  const handleFlagStudent = async (studentId, activityType = 'suspicious') => {
    try {
      const description = prompt('Please describe the suspicious activity:');
      if (description) {
        await proctorAPI.flagSuspiciousActivity(studentId, selectedExam.id, activityType, description);
        // Refresh activity logs
        await loadActivityLogs(selectedExam.id);
        // Update student status in UI
        setExamStudents(students => 
          students.map(student => 
            student.studentId === studentId 
              ? { ...student, status: 'flagged' }
              : student
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEndMonitoring = async () => {
    if (window.confirm('Are you sure you want to end monitoring for this exam?')) {
      try {
        await proctorAPI.endMonitoring(selectedExam.id);
        setSelectedExam(null);
        await loadDashboardData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (timeString) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  const getActivityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return FaExclamationTriangle;
      case 'warning':
        return FaFlag;
      default:
        return FaEye;
    }
  };

  const tabs = [
    { id: 'monitor', label: 'Live Monitoring', icon: FaVideo },
    { id: 'activity', label: 'Activity Logs', icon: FaHistory }
  ];

  if (loading) {
    return (
      <div className="dashboard theme-proctor">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-logo">E</div>
              <div className="header-info">
                <h1>Proctor Portal</h1>
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
    <div className="dashboard theme-proctor">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">E</div>
            <div className="header-info">
              <h1>Proctor Portal</h1>
              <p>Exam Monitoring & Supervision</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{user?.name}</h3>
                <p>{user?.proctorId} • Proctor</p>
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

        {/* Exam Selection */}
        {activeExams.length > 0 && (
          <div className="content-card" style={{marginBottom: 'var(--spacing-6)'}}>
            <div className="card-body">
              <div className="form-group" style={{marginBottom: 0}}>
                <label className="form-label">Select Active Exam</label>
                <select
                  className="form-select"
                  value={selectedExam?.id || ''}
                  onChange={(e) => {
                    const exam = activeExams.find(ex => ex.id === parseInt(e.target.value));
                    setSelectedExam(exam);
                  }}
                >
                  {activeExams.map(exam => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title} - {exam.activeStudents}/{exam.studentsCount} active
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Exam Overview */}
        {selectedExam && (
          <div className="exam-overview">
            <div className="exam-header">
              <div>
                <h2 className="exam-title">{selectedExam.title}</h2>
                <p className="exam-subtitle">
                  Started at {formatTime(selectedExam.startTime)} • 
                  Ends at {formatTime(selectedExam.endTime)}
                </p>
              </div>
              <div className="exam-timer">
                <p className="timer-label">Time Remaining</p>
                <p className="timer-value">{examTimer}</p>
              </div>
            </div>
            <div className="exam-stats">
              <div className="exam-stat">
                <p className="exam-stat-value">{selectedExam.studentsCount}</p>
                <p className="exam-stat-label">Total Students</p>
              </div>
              <div className="exam-stat">
                <p className="exam-stat-value">{selectedExam.activeStudents}</p>
                <p className="exam-stat-label">Active Now</p>
              </div>
              <div className="exam-stat">
                <p className="exam-stat-value">{examStudents.filter(s => s.status === 'flagged').length}</p>
                <p className="exam-stat-label">Flagged</p>
              </div>
              <div className="exam-stat">
                <p className="exam-stat-value">{activityLogs.filter(log => log.severity === 'warning' || log.severity === 'error').length}</p>
                <p className="exam-stat-label">Incidents</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls Panel */}
        {selectedExam && (
          <div className="controls-panel">
            <h3 className="controls-title">Monitoring Controls</h3>
            <div className="control-buttons">
              <button className="control-btn primary">
                <FaPlay />
                Record Session
              </button>
              <button className="control-btn secondary">
                <FaShieldAlt />
                Enable Lockdown
              </button>
              <button 
                className="control-btn danger"
                onClick={handleEndMonitoring}
              >
                <FaStop />
                End Monitoring
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'monitor' && selectedExam && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Live Student Monitoring</h2>
            </div>

            {examStudents.length === 0 ? (
              <div className="empty-state">
                <FaUsers className="empty-state-icon" />
                <h3>No Active Students</h3>
                <p>No students are currently taking this exam.</p>
              </div>
            ) : (
              <div className="webcam-grid">
                {examStudents.map(student => (
                  <div 
                    key={student.id} 
                    className={`webcam-card ${student.status === 'flagged' ? 'flagged' : student.status === 'warning' ? 'warning' : ''}`}
                  >
                    <div className="webcam-header">
                      <div className="student-info">
                        <h4>{student.studentName}</h4>
                        <p>ID: {student.studentId}</p>
                      </div>
                      <div className="student-status">
                        <div className={`status-indicator ${student.status}`}></div>
                        <span className="text-sm">{student.status}</span>
                      </div>
                    </div>
                    
                    <div className="webcam-feed">
                      {student.webcamUrl ? (
                        <video 
                          src={student.webcamUrl} 
                          autoPlay 
                          muted 
                          onDoubleClick={() => setFullscreenStudent(student)}
                        />
                      ) : (
                        <div className="webcam-placeholder">
                          <FaVideo className="placeholder-icon" />
                          <p>Camera not available</p>
                        </div>
                      )}
                    </div>

                    <div className="webcam-controls">
                      <div className="webcam-time">
                        Started: {formatTime(student.startTime)}
                      </div>
                      <div className="webcam-actions">
                        <button 
                          className="warning-btn"
                          onClick={() => handleFlagStudent(student.studentId, 'warning')}
                          title="Issue Warning"
                        >
                          ⚠️
                        </button>
                        <button 
                          className="flag-btn"
                          onClick={() => handleFlagStudent(student.studentId, 'violation')}
                          title="Flag Violation"
                        >
                          <FaFlag />
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => setFullscreenStudent(student)}
                          title="Fullscreen"
                        >
                          <FaExpand />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && selectedExam && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Activity Logs</h2>
            </div>

            <div className="activity-log">
              <div className="activity-log-header">
                <h3 className="activity-log-title">Recent Activity</h3>
              </div>
              
              {activityLogs.length === 0 ? (
                <div className="empty-state">
                  <FaHistory className="empty-state-icon" />
                  <h3>No Activity Logged</h3>
                  <p>Activity logs will appear here as they occur.</p>
                </div>
              ) : (
                <div>
                  {activityLogs.map(log => {
                    const IconComponent = getActivityIcon(log.severity);
                    return (
                      <div key={log.id} className="activity-item">
                        <div className={`activity-icon ${log.severity}`}>
                          <IconComponent />
                        </div>
                        <div className="activity-content">
                          <div className="activity-student">{log.studentName}</div>
                          <div className="activity-message">{log.activity}</div>
                          <div className="activity-time">{formatRelativeTime(log.timestamp)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedExam && activeExams.length === 0 && (
          <div className="empty-state">
            <FaEye className="empty-state-icon" />
            <h3>No Active Exams</h3>
            <p>There are currently no exams available for monitoring.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Webcam Modal */}
      {fullscreenStudent && (
        <div className="fullscreen-webcam">
          <video 
            src={fullscreenStudent.webcamUrl} 
            autoPlay 
            muted 
            controls
          />
          <div className="fullscreen-controls">
            <button 
              className="fullscreen-btn"
              onClick={() => handleFlagStudent(fullscreenStudent.studentId, 'violation')}
              title="Flag Violation"
            >
              <FaFlag />
            </button>
            <button 
              className="fullscreen-btn"
              onClick={() => setFullscreenStudent(null)}
              title="Exit Fullscreen"
            >
              <FaCompress />
            </button>
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: 'var(--spacing-4)',
            left: 'var(--spacing-4)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: 'var(--spacing-3)',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{margin: 0}}>{fullscreenStudent.studentName}</h4>
            <p style={{margin: 0, fontSize: 'var(--font-size-sm)'}}>
              ID: {fullscreenStudent.studentId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProctorDashboard;