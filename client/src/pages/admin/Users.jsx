import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const emptyForm = { firstname: '', lastname: '', username: '', password: '', avatar: '' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const { data } = await api.get('/users');
    setUsers(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(emptyForm); setAvatarFile(null); setEditingId(null); setModalOpen(true); }
  function openEdit(u) { setForm({ ...u, password: '' }); setAvatarFile(null); setEditingId(u._id); setModalOpen(true); }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append('firstname', form.firstname);
      body.append('lastname', form.lastname);
      body.append('username', form.username);
      if (form.password) body.append('password', form.password);
      if (avatarFile) body.append('avatar', avatarFile);

      if (editingId) await api.put(`/users/${editingId}`, body);
      else await api.post('/users', body);
      toast('User Details successfully saved.');
      setModalOpen(false);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  }

  async function doDelete() {
    try {
      await api.delete(`/users/${confirmDelete._id}`);
      toast('User successfully deleted.');
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error');
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-navy-900">Staff Users</h1>
          <p className="text-slate-500 mt-1">Manage administrator and staff accounts for the console.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800">+ New User</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3">Name</th>
              <th className="px-2 py-3">Username</th>
              <th className="px-2 py-3">Avatar</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading…</td></tr>}
            {!loading && users.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No staff users yet.</td></tr>}
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-50 last:border-0">
                <td className="px-6 py-3 text-navy-900">{u.firstname} {u.lastname}</td>
                <td className="px-2 py-3 text-slate-500">@{u.username}</td>
                <td className="px-2 py-3">
                  <div className="w-8 h-8 rounded-full bg-navy-100 overflow-hidden flex items-center justify-center text-xs font-semibold text-navy-700">
                    {u.avatar ? <img src={`/${u.avatar}`} alt="" className="w-full h-full object-cover" /> : u.firstname?.[0]}
                  </div>
                </td>
                <td className="px-6 py-3 text-right space-x-3">
                  <button onClick={() => openEdit(u)} className="text-navy-600 hover:underline text-xs font-medium">Edit</button>
                  <button onClick={() => setConfirmDelete(u)} className="text-rose-600 hover:underline text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Staff User' : 'New Staff User'} onClose={() => setModalOpen(false)}
        footer={<>
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button form="user-form" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </>}>
        <form id="user-form" onSubmit={submit} className="space-y-4">
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
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Username</span>
            <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">{editingId ? 'New Password (optional)' : 'Password'}</span>
            <input type="password" required={!editingId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Avatar (optional)</span>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-navy-50 file:text-navy-700 file:text-sm file:font-medium hover:file:bg-navy-100" />
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete} title="Delete User"
        message={confirmDelete ? `Delete staff user @${confirmDelete.username}?` : ''}
        onConfirm={doDelete} onClose={() => setConfirmDelete(null)} danger
      />
    </div>
  );
}
