import { createContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rescuelink_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('rescuelink_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const endpoint = payload.role === 'rescuer' ? '/api/auth/rescuer/login' : '/api/auth/login';
    const { data } = await api.post(endpoint, payload);
    localStorage.setItem('rescuelink_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    if (data.token) {
      localStorage.setItem('rescuelink_token', data.token);
      setUser(data.user);
    }
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('rescuelink_token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
