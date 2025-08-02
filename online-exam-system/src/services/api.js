import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials, role) => {
    try {
      const response = await api.post('/auth/login', { ...credentials, role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  },
};

// Student API
export const studentAPI = {
  getExams: async () => {
    try {
      // Mock data for development
      return mockData.studentExams;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch exams');
    }
  },

  getExamById: async (examId) => {
    try {
      const exam = mockData.studentExams.find(e => e.id === parseInt(examId));
      if (!exam) throw new Error('Exam not found');
      return exam;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch exam');
    }
  },

  getResults: async () => {
    try {
      return mockData.studentResults;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch results');
    }
  },

  startExam: async (examId) => {
    try {
      // Mock starting exam
      return { success: true, examSession: `session_${examId}_${Date.now()}` };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to start exam');
    }
  },

  submitExam: async (examId, answers) => {
    try {
      // Mock exam submission
      return { success: true, submissionId: `sub_${examId}_${Date.now()}` };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit exam');
    }
  },
};

// Teacher API
export const teacherAPI = {
  getExams: async () => {
    try {
      return mockData.teacherExams;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch exams');
    }
  },

  createExam: async (examData) => {
    try {
      // Mock exam creation
      const newExam = {
        id: Date.now(),
        ...examData,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };
      return newExam;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create exam');
    }
  },

  updateExam: async (examId, examData) => {
    try {
      // Mock exam update
      return { ...examData, id: examId, updatedAt: new Date().toISOString() };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update exam');
    }
  },

  deleteExam: async (examId) => {
    try {
      // Mock exam deletion
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete exam');
    }
  },

  getSubmissions: async (examId) => {
    try {
      return mockData.examSubmissions.filter(sub => sub.examId === parseInt(examId));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submissions');
    }
  },

  gradeSubmission: async (submissionId, grade) => {
    try {
      // Mock grading
      return { success: true, grade };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to grade submission');
    }
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    try {
      return mockData.users;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  createUser: async (userData) => {
    try {
      // Mock user creation
      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      return newUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  updateUser: async (userId, userData) => {
    try {
      // Mock user update
      return { ...userData, id: userId, updatedAt: new Date().toISOString() };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  deleteUser: async (userId) => {
    try {
      // Mock user deletion
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  getSystemStats: async () => {
    try {
      return mockData.systemStats;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system stats');
    }
  },

  generateReport: async (reportType, filters) => {
    try {
      // Mock report generation
      return { 
        success: true, 
        reportId: `report_${reportType}_${Date.now()}`,
        downloadUrl: `/api/reports/download/report_${reportType}_${Date.now()}.pdf`
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate report');
    }
  },
};

// Proctor API
export const proctorAPI = {
  getActiveExams: async () => {
    try {
      return mockData.activeExams;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active exams');
    }
  },

  getExamStudents: async (examId) => {
    try {
      return mockData.examStudents.filter(student => student.examId === parseInt(examId));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch exam students');
    }
  },

  flagSuspiciousActivity: async (studentId, examId, activityType, description) => {
    try {
      // Mock flagging suspicious activity
      return { 
        success: true, 
        flagId: `flag_${studentId}_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to flag activity');
    }
  },

  endMonitoring: async (examId) => {
    try {
      // Mock ending monitoring
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to end monitoring');
    }
  },

  getActivityLogs: async (examId) => {
    try {
      return mockData.activityLogs.filter(log => log.examId === parseInt(examId));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  },
};

// Mock data for development
const mockData = {
  studentExams: [
    {
      id: 1,
      title: 'Mathematics Final Exam',
      subject: 'Mathematics',
      date: '2024-01-15',
      time: '10:00',
      duration: 120,
      status: 'upcoming',
      description: 'Final examination covering all topics from the semester'
    },
    {
      id: 2,
      title: 'Physics Midterm',
      subject: 'Physics',
      date: '2024-01-10',
      time: '14:00',
      duration: 90,
      status: 'completed',
      description: 'Midterm examination covering mechanics and thermodynamics'
    }
  ],

  studentResults: [
    {
      id: 1,
      examId: 2,
      examTitle: 'Physics Midterm',
      score: 85,
      maxScore: 100,
      grade: 'B+',
      completedAt: '2024-01-10T15:30:00Z',
      feedback: 'Good performance, focus on thermodynamics concepts'
    }
  ],

  teacherExams: [
    {
      id: 1,
      title: 'Mathematics Final Exam',
      subject: 'Mathematics',
      date: '2024-01-15',
      time: '10:00',
      duration: 120,
      status: 'published',
      studentsCount: 25,
      submissionsCount: 0
    },
    {
      id: 2,
      title: 'Physics Midterm',
      subject: 'Physics',
      date: '2024-01-10',
      time: '14:00',
      duration: 90,
      status: 'completed',
      studentsCount: 30,
      submissionsCount: 28
    }
  ],

  examSubmissions: [
    {
      id: 1,
      examId: 2,
      studentId: 1,
      studentName: 'John Doe',
      submittedAt: '2024-01-10T15:30:00Z',
      score: 85,
      status: 'graded'
    }
  ],

  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      department: 'Computer Science',
      createdAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'teacher',
      department: 'Mathematics',
      createdAt: '2024-01-01T00:00:00Z',
      status: 'active'
    }
  ],

  systemStats: {
    totalUsers: 150,
    totalExams: 45,
    activeExams: 3,
    totalSubmissions: 1250
  },

  activeExams: [
    {
      id: 1,
      title: 'Mathematics Final Exam',
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T12:00:00Z',
      studentsCount: 25,
      activeStudents: 23
    }
  ],

  examStudents: [
    {
      id: 1,
      examId: 1,
      studentId: 1,
      studentName: 'John Doe',
      webcamUrl: '/api/webcam/student/1',
      status: 'active',
      startTime: '2024-01-15T10:00:00Z',
      lastActivity: '2024-01-15T10:45:00Z'
    }
  ],

  activityLogs: [
    {
      id: 1,
      examId: 1,
      studentId: 1,
      studentName: 'John Doe',
      activity: 'Tab switched',
      timestamp: '2024-01-15T10:30:00Z',
      severity: 'warning'
    }
  ]
};

export default api;