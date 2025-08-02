import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const actionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const userData = localStorage.getItem('userData');
        const userRole = localStorage.getItem('userRole');
        
        if (userData && userRole) {
          dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: {
              user: JSON.parse(userData),
              role: userRole
            }
          });
        } else {
          dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    checkExistingSession();
  }, []);

  // Login function
  const login = async (credentials, role) => {
    dispatch({ type: actionTypes.LOGIN_START });

    try {
      // Simulate API call - replace with actual API
      const response = await simulateLogin(credentials, role);
      
      if (response.success) {
        const userData = response.user;
        
        // Store in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userRole', role);
        localStorage.setItem('authToken', response.token);

        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: {
            user: userData,
            role: role
          }
        });

        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    dispatch({ type: actionTypes.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simulate login API call - replace with actual API
const simulateLogin = async (credentials, role) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock user data based on role
      const mockUsers = {
        student: {
          id: 1,
          name: 'John Doe',
          email: credentials.email,
          studentId: 'ST001',
          department: 'Computer Science',
          avatar: null
        },
        teacher: {
          id: 2,
          name: 'Jane Smith',
          email: credentials.email,
          teacherId: 'TC001',
          department: 'Mathematics',
          avatar: null
        },
        admin: {
          id: 3,
          name: 'Admin User',
          email: credentials.email,
          adminId: 'AD001',
          permissions: ['all'],
          avatar: null
        },
        proctor: {
          id: 4,
          name: 'Proctor User',
          email: credentials.email,
          proctorId: 'PR001',
          assignedExams: [],
          avatar: null
        }
      };

      // Simple validation (replace with actual validation)
      if (credentials.email && credentials.password) {
        resolve({
          success: true,
          user: mockUsers[role],
          token: `mock-jwt-token-${role}-${Date.now()}`
        });
      } else {
        resolve({
          success: false,
          message: 'Invalid credentials'
        });
      }
    }, 1000); // Simulate network delay
  });
};

export default AuthContext;