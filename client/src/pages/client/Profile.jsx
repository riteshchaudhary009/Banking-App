import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function ClientProfile() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    firstname: profile?.firstname || '', lastname: profile?.lastname || '',
    middlename: profile?.middlename || '', email: profile?.email || '', password: '',
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/accounts/me', form);
      toast('Profile successfully updated.');
      setForm({ ...form, password: '' });
      refreshProfile();
    } catch (err) {
      toast(err.response?.data?.message || 'Update failed', 'error');
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-900">Profile</h1>
        <p className="text-slate-500 mt-1">Update your personal details and password.</p>
      </div>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">First Name</span>
            <input required value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</span>
            <input required value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
          </label>
        </div>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Middle Name</span>
          <input value={form.middlename} onChange={(e) => setForm({ ...form, middlename: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Email</span>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">New Password (optional)</span>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
        </label>
        <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
