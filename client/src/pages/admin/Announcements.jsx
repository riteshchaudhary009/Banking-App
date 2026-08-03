import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatDate } from '../../utils/format';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', announcement: '' });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const { data } = await api.get('/announcements');
    setItems(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setForm({ title: '', announcement: '' }); setEditingId(null); setModalOpen(true); }
  function openEdit(a) { setForm({ title: a.title, announcement: a.announcement }); setEditingId(a._id); setModalOpen(true); }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) await api.put(`/announcements/${editingId}`, form);
      else await api.post('/announcements', form);
      toast('Announcement successfully saved.');
      setModalOpen(false);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  }

  async function doDelete() {
    try {
      await api.delete(`/announcements/${confirmDelete._id}`);
      toast('Announcement successfully deleted.');
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
          <h1 className="font-display text-3xl text-navy-900">Announcements</h1>
          <p className="text-slate-500 mt-1">Post updates that clients will see on their dashboard.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800">+ New Announcement</button>
      </div>

      <div className="grid gap-4">
        {loading && <p className="text-slate-400">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-slate-400">No announcements yet.</p>}
        {items.map((a) => (
          <div key={a._id} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg text-navy-900">{a.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(a.dateCreated)}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => openEdit(a)} className="text-navy-600 hover:underline text-xs font-medium">Edit</button>
                <button onClick={() => setConfirmDelete(a)} className="text-rose-600 hover:underline text-xs font-medium">Delete</button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none mt-3 text-slate-600" dangerouslySetInnerHTML={{ __html: a.announcement }} />
          </div>
        ))}
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Announcement' : 'New Announcement'} onClose={() => setModalOpen(false)} wide
        footer={<>
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button form="ann-form" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </>}>
        <form id="ann-form" onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Title</span>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Content</span>
            <textarea required rows={6} value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600"
              placeholder="Basic HTML is supported (e.g. <p>, <b>, <a>)." />
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete} title="Delete Announcement"
        message={confirmDelete ? `Delete "${confirmDelete.title}"? This cannot be undone.` : ''}
        onConfirm={doDelete} onClose={() => setConfirmDelete(null)} danger
      />
    </div>
  );
}
