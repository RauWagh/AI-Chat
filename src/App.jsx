import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/login" replace />
    }
    
    return children
  }

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to={`/${user?.role}`} replace /> : 
              <Login onLogin={login} />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager" 
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to={`/${user?.role}`} replace /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </div>
  )
}

export default App