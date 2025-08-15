import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Initialize with mock data
  useEffect(() => {
    const mockTasks = [
      {
        id: uuidv4(),
        title: 'Complete Q4 Report',
        description: 'Prepare and submit the quarterly financial report',
        assignedTo: 3,
        assignedBy: 2,
        priority: 'High',
        status: 'In Progress',
        deadline: '2024-01-15',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      },
      {
        id: uuidv4(),
        title: 'Update Employee Handbook',
        description: 'Review and update the employee handbook with new policies',
        assignedTo: 2,
        assignedBy: 1,
        priority: 'Medium',
        status: 'To Do',
        deadline: '2024-01-20',
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02'
      },
      {
        id: uuidv4(),
        title: 'Organize Team Building Event',
        description: 'Plan and organize the monthly team building activity',
        assignedTo: 3,
        assignedBy: 2,
        priority: 'Low',
        status: 'Done',
        deadline: '2024-01-10',
        createdAt: '2023-12-28',
        updatedAt: '2024-01-08'
      }
    ];

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(mockTasks);
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
  }, []);

  const createTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      ...taskData,
      assignedBy: user.id,
      status: 'To Do',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getTasksByUser = (userId) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  const getTasksAssignedBy = (userId) => {
    return tasks.filter(task => task.assignedBy === userId);
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(task => task.status === 'To Do').length,
      inProgress: tasks.filter(task => task.status === 'In Progress').length,
      done: tasks.filter(task => task.status === 'Done').length
    };
    return stats;
  };

  const getMyTasks = () => {
    if (!user) return [];
    return tasks.filter(task => task.assignedTo === user.id);
  };

  const value = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByUser,
    getTasksAssignedBy,
    getTaskStats,
    getMyTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};