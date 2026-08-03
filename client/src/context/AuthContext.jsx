import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(data.role);
      setProfile(data.role === 'admin' ? data.user : data.account);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshProfile(); }, []);

  function loginAs(newRole, token, entity) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', newRole);
    setRole(newRole);
    setProfile(entity);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ role, profile, setProfile, loading, loginAs, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
