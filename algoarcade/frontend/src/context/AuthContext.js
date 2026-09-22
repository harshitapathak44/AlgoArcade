// ============================================================
// AuthContext - Global authentication state management
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Axios base URL config
const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('algoarcade_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken]     = useState(localStorage.getItem('algoarcade_token'));

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('algoarcade_token');
      if (!savedToken) { setLoading(false); return; }

      try {
        const res = await API.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('algoarcade_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('algoarcade_token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await API.post('/auth/register', { username, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('algoarcade_token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('algoarcade_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export { API };
