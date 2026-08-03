import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
  const [form, setForm] = useState({ name: '', shortName: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [current, setCurrent] = useState({ logo: '', cover: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { refresh } = useSettings();

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/settings');
      setForm({ name: data.name, shortName: data.shortName });
      setCurrent({ logo: data.logo, cover: data.cover });
      setLoading(false);
    })();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append('name', form.name);
      body.append('shortName', form.shortName);
      if (logoFile) body.append('logo', logoFile);
      if (coverFile) body.append('cover', coverFile);
      const { data } = await api.put('/settings', body);
      setCurrent({ logo: data.settings.logo, cover: data.settings.cover });
      setLogoFile(null); setCoverFile(null);
      toast('Settings successfully updated.');
      refresh();
    } catch (err) {
      toast(err.response?.data?.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  }

  if (loading) return <div className="p-8 text-slate-400">Loading…</div>;

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-900">System Settings</h1>
        <p className="text-slate-500 mt-1">Branding and general information shown across the site.</p>
      </div>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">System Name</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Short Name</span>
          <input required value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Logo</span>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {(logoFile || current.logo) ? (
                <img src={logoFile ? URL.createObjectURL(logoFile) : `/${current.logo}`} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-slate-300">None</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-navy-50 file:text-navy-700 file:text-sm file:font-medium hover:file:bg-navy-100" />
          </div>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image</span>
          <div className="flex items-center gap-3">
            <div className="w-24 h-14 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {(coverFile || current.cover) ? (
                <img src={coverFile ? URL.createObjectURL(coverFile) : `/${current.cover}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-300">None</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-navy-50 file:text-navy-700 file:text-sm file:font-medium hover:file:bg-navy-100" />
          </div>
        </label>

        <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
