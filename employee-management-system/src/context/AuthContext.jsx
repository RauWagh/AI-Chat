import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock users data (in a real app, this would come from a backend)
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      email: 'admin@company.com',
      role: 'admin',
      name: 'Admin User',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
    },
    {
      id: 2,
      username: 'manager',
      password: 'manager123',
      email: 'manager@company.com',
      role: 'manager',
      name: 'Manager User',
      avatar: 'https://ui-avatars.com/api/?name=Manager+User&background=28A745&color=fff'
    },
    {
      id: 3,
      username: 'employee',
      password: 'employee123',
      email: 'employee@company.com',
      role: 'employee',
      name: 'Employee User',
      avatar: 'https://ui-avatars.com/api/?name=Employee+User&background=FFC107&color=000'
    }
  ];

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password
      );
      
      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updateProfile,
    mockUsers: mockUsers.map(u => ({ ...u, password: undefined })) // Remove passwords for security
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};