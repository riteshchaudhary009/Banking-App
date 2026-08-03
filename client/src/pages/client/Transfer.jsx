import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { formatCurrency } from '../../utils/format';

export default function ClientTransfer() {
  const { profile, refreshProfile } = useAuth();
  const [number, setNumber] = useState('');
  const [status, setStatus] = useState(null);
  const [target, setTarget] = useState(null);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!number) { setStatus(null); setTarget(null); return; }
    setStatus('checking');
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(`/accounts/lookup/${number}`);
        if (String(data.data.id) === String(profile.id)) { setStatus('missing'); setTarget(null); return; }
        setTarget(data.data);
        setStatus('found');
      } catch { setTarget(null); setStatus('missing'); }
    }, 400);
    return () => clearTimeout(t);
  }, [number]);

  async function submit(e) {
    e.preventDefault();
    if (!target) return toast('Enter a valid recipient account number', 'warning');
    if (parseFloat(amount) > profile.balance) return toast('Amount is greater than your balance', 'warning');
    setBusy(true);
    try {
      await api.post('/transactions/transfer', { toAccountId: target.id, amount });
      toast('Transfer successfully processed.');
      setNumber(''); setAmount('');
      refreshProfile();
    } catch (err) {
      toast(err.response?.data?.message || 'Transfer failed', 'error');
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-900">Transfer Funds</h1>
        <p className="text-slate-500 mt-1">Send money instantly to another Meridian account.</p>
      </div>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3 text-sm">
          <span className="text-slate-500">Available balance</span>
          <span className="font-mono text-navy-900">{formatCurrency(profile?.balance)}</span>
        </div>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Recipient Account Number</span>
          <input
            value={number} onChange={(e) => setNumber(e.target.value)} required
            className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
              status === 'found' ? 'border-emerald-300' : status === 'missing' ? 'border-rose-300' : 'border-slate-200'
            }`}
            placeholder="e.g. 10140715"
          />
          {status === 'checking' && <span className="text-xs text-slate-400">Checking availability…</span>}
          {status === 'found' && <span className="text-xs text-emerald-600">{target.name}</span>}
          {status === 'missing' && <span className="text-xs text-rose-600">Account not found.</span>}
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Amount</span>
          <input type="number" min="0" step="any" required value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
        </label>
        <button disabled={busy} className="w-full py-2.5 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-60">
          {busy ? 'Processing…' : 'Send Transfer'}
        </button>
      </form>
    </div>
  );
}
