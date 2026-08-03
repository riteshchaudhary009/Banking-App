import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, formatDate } from '../../utils/format';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';

const emptyForm = { accountNumber: '', pin: '', firstname: '', lastname: '', address: '', phone: '', middlename: '', email: '', password: '', balance: 0 };

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null); // { account, transactions }
  const [confirmDelete, setConfirmDelete] = useState(null);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const { data } = await api.get('/accounts');
    setAccounts(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }
  function openEdit(a) {
    setForm({ ...a, password: '' });
    setEditingId(a._id);
    setModalOpen(true);
  }
  async function openDetail(a) {
    const { data } = await api.get(`/transactions/account/${a._id}`);
    setDetail(data);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/accounts/${editingId}`, form);
        toast('Account successfully saved.');
      } else {
        await api.post('/accounts', form);
        toast('Account successfully created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    try {
      await api.delete(`/accounts/${confirmDelete._id}`);
      toast('Account successfully deleted.');
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error');
    }
  }

  const filtered = accounts.filter((a) =>
    `${a.firstname} ${a.lastname} ${a.accountNumber} ${a.address} ${a.phone} ${a.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-navy-900">Client Accounts</h1>
          <p className="text-slate-500 mt-1">Create, edit and manage customer bank accounts.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800">+ New Account</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, account number or email…"
            className="w-full max-w-sm px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600"
          />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3">Account </th>
              <th className="px-2 py-3">Name</th>
              <th className="px-2 py-3">Email</th>
              <th className="px-2 py-3 text-right">Balance</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No accounts found.</td></tr>}
            {filtered.map((a) => (
              <tr key={a._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-6 py-3 font-mono text-navy-700">{a.accountNumber}</td>
                <td className="px-2 py-3 text-navy-900">{a.lastname}, {a.firstname} {a.middlename}</td>
                <td className="px-2 py-3 text-slate-500">{a.email}</td>
                <td className="px-2 py-3 text-right font-mono text-navy-900">{formatCurrency(a.balance)}</td>
                <td className="px-6 py-3 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => openDetail(a)} className="text-navy-600 hover:underline text-xs font-medium">View</button>
                  <button onClick={() => openEdit(a)} className="text-navy-600 hover:underline text-xs font-medium">Edit</button>
                  <button onClick={() => setConfirmDelete(a)} className="text-rose-600 hover:underline text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title={editingId ? 'Edit Account' : 'New Client Account'} onClose={() => setModalOpen(false)} wide
        footer={<>
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button form="account-form" disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-navy-900 hover:bg-navy-800 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Account'}
          </button>
        </>}>
        <form id="account-form" onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <Field label="Account Number" required value={form.accountNumber} onChange={(v) => setForm({ ...form, accountNumber: v })} />
          <Field label="PIN" required value={form.pin} onChange={(v) => setForm({ ...form, pin: v })} />
          <Field label="First Name" required value={form.firstname} onChange={(v) => setForm({ ...form, firstname: v })} />
          <Field label="Last Name" required value={form.lastname} onChange={(v) => setForm({ ...form, lastname: v })} />
          <Field label="Middle Name" value={form.middlename} onChange={(v) => setForm({ ...form, middlename: v })} />
          <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label={editingId ? 'New Password (optional)' : 'Password (optional — auto-generated if blank)'} type="password"
            value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          {!editingId && (
            <Field label="Opening Balance" type="number" value={form.balance} onChange={(v) => setForm({ ...form, balance: v })} />
          )}
        </form>
      </Modal>

      <Modal open={!!detail} title="Account Details" onClose={() => setDetail(null)} wide>
        {detail && (
          <div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
              <Info label="Name" value={`${detail.account.lastname}, ${detail.account.firstname} ${detail.account.middlename || ''}`} />
              <Info label="Account Number" value={`${detail.account.accountNumber}`} mono />
              <Info label="Email" value={detail.account.email} />
              <Info label="Balance" value={`${formatCurrency(detail.account.balance)}`} mono />
            </div>
            <h4 className="font-display text-base text-navy-900 mb-2">Transaction History</h4>
            <div className="border border-slate-100 rounded-lg overflow-hidden max-h-72 overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <tbody>
                  {detail.transactions.length === 0 && <tr><td className="px-4 py-4 text-slate-400">No transactions.</td></tr>}
                  {detail.transactions.map((t) => (
                    <tr key={t._id} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-2 text-slate-500">{formatDate(t.dateCreated)}</td>
                      <td className="px-4 py-2 text-navy-900">{t.remarks}</td>
                      <td className="px-4 py-2 text-right font-mono">{formatCurrency(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Account"
        message={confirmDelete ? `Delete account ${confirmDelete.accountNumber} (${confirmDelete.firstname} ${confirmDelete.lastname})? This also removes its transaction history and cannot be undone.` : ''}
        onConfirm={doDelete}
        onClose={() => setConfirmDelete(null)}
        danger
      />
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}{required && ' *'}</span>
      <input
        type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600"
      />
    </label>
  );
}

function Info({ label, value, mono }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</p>
      <p className={`text-navy-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
