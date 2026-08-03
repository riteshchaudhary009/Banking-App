import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/Toast';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
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
      const { data } = await api.post('/auth/client/login', { email, password });
      loginAs('client', data.token, data.account);
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl text-white">{name}</Link>
          <p className="text-navy-300 text-sm mt-1">Client Online Banking</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-600"
              placeholder="you@example.com"
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
          <p className="text-xs text-slate-400 text-center">Demo: jsmith@sample.com / client123</p>
        </form>
        <p className="text-center mt-6">
          <Link to="/admin/login" className="text-navy-300 text-sm hover:text-white">Staff login &rarr;</Link>
        </p>
         <p className="text-center mt-6">
          <Link to="/" className="text-navy-300 text-sm hover:text-white">Back to Home &rarr;</Link>
        </p>
      </div>
    </div>
  );
}
