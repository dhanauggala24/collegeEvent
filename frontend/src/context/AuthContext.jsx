import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  setAuthSession,
  clearAuthSession,
  getAuthToken
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('portal_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(true);

  // Load profile on initial load
  useEffect(() => {
    async function loadProfile() {
      if (token) {
        try {
          const res = await getCurrentUser();
          if (res && res.success) {
            setUser(res.user);
            localStorage.setItem('portal_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setAuthSession(res.token, res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setAuthSession(res.token, res.user);
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    clearAuthSession();
  };

  const refreshUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res && res.success) {
        setUser(res.user);
        localStorage.setItem('portal_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Could not refresh profile:', err.message);
    }
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
