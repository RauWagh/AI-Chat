import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskManagement from './components/TaskManagement';
import UserManagement from './components/UserManagement';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NotificationProvider>
          <Router>
            <div className="app">
              <AppContent />
            </div>
          </Router>
        </NotificationProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <main className={user ? 'main-content' : 'main-content-full'}>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks" 
            element={user ? <TaskManagement /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/users" 
            element={user && (user.role === 'admin' || user.role === 'manager') ? 
              <UserManagement /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
