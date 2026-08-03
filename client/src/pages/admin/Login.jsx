import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/Toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const { loginAs } = useAuth();
  const { name } = useSettings();
  const toast = useToast();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/auth/admin/login', { username, password });
      loginAs('admin', data.token, data.user);
      navigate('/admin');
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl text-navy-900">{name}</Link>
          <p className="text-slate-500 text-sm mt-1">Staff / Admin Console</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
            <input
              required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-600"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-600"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={busy}
            className="w-full py-2.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800 disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs text-slate-400 text-center">Demo: admin / admin123</p>
        </form>
        <p className="text-center mt-6">
          <Link to="/login" className="text-slate-500 text-sm hover:text-navy-900">Client login &rarr;</Link>
        </p>
        <p className="text-center mt-6">
          <Link to="/" className="text-slate-500 text-sm hover:text-black">Back to Home &rarr;</Link>
        </p>
      </div>
    </div>
  );
}
