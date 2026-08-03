import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, formatDate, TX_TYPES } from '../../utils/format';
import { useToast } from '../../components/Toast';

const TABS = [
  { key: 'deposit', label: 'Deposit' },
  { key: 'withdraw', label: 'Withdraw' },
  { key: 'transfer', label: 'Transfer' },
];

function useAccountLookup() {
  const [number, setNumber] = useState('');
  const [status, setStatus] = useState(null); // null | 'checking' | 'found' | 'missing'
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!number) { setStatus(null); setAccount(null); return; }
    setStatus('checking');
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(`/accounts/lookup/${number}`);
        setAccount(data.data);
        setStatus('found');
      } catch {
        setAccount(null);
        setStatus('missing');
      }
    }, 400);
    return () => clearTimeout(t);
  }, [number]);

  return { number, setNumber, status, account };
}

export default function Transactions() {
  const [tab, setTab] = useState('deposit');
  const [tx, setTx] = useState([]);
  const toast = useToast();

  async function loadTx() {
    const { data } = await api.get('/transactions');
    setTx(data);
  }
  useEffect(() => { loadTx(); }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-900">Transactions</h1>
        <p className="text-slate-500 mt-1">Process deposits, withdrawals and transfers on behalf of clients.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 mb-8">
        <div className="flex border-b border-slate-100">
          {TABS.map((t) => (
            <button
              key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-3.5 text-sm font-medium border-b-2 -mb-px ${
                tab === t.key ? 'border-navy-900 text-navy-900' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === 'deposit' && <DepositForm onDone={loadTx} toast={toast} />}
          {tab === 'withdraw' && <WithdrawForm onDone={loadTx} toast={toast} />}
          {tab === 'transfer' && <TransferForm onDone={loadTx} toast={toast} />}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-display text-lg text-navy-900">All Transactions</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3">Date</th>
              <th className="px-2 py-3">Account</th>
              <th className="px-2 py-3">Type</th>
              <th className="px-2 py-3">Remarks</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {tx.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No transactions yet.</td></tr>}
            {tx.map((t) => (
              <tr key={t._id} className="border-b border-slate-50 last:border-0">
                <td className="px-6 py-3 text-slate-500">{formatDate(t.dateCreated)}</td>
                <td className="px-2 py-3 text-navy-900">{t.account ? `${t.account.lastname}, ${t.account.firstname} (#${t.account.accountNumber})` : '—'}</td>
                <td className="px-2 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 font-medium">{TX_TYPES[t.type]}</span></td>
                <td className="px-2 py-3 text-slate-500">{t.remarks}</td>
                <td className="px-6 py-3 text-right font-mono text-navy-900">{formatCurrency(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LookupField({ label, lookup }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      <input
        value={lookup.number} onChange={(e) => lookup.setNumber(e.target.value)}
        className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 ${
          lookup.status === 'found' ? 'border-emerald-300' : lookup.status === 'missing' ? 'border-rose-300' : 'border-slate-200'
        }`}
        placeholder="Enter account number"
      />
      {lookup.status === 'checking' && <span className="text-xs text-slate-400">Checking availability…</span>}
      {lookup.status === 'found' && <span className="text-xs text-emerald-600">{lookup.account.name} — Balance: ${formatMoney(lookup.account.balance)}</span>}
      {lookup.status === 'missing' && <span className="text-xs text-rose-600">Account not found.</span>}
    </label>
  );
}

function DepositForm({ onDone, toast }) {
  const lookup = useAccountLookup();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!lookup.account) return toast('Look up a valid account number first', 'warning');
    setBusy(true);
    try {
      await api.post('/transactions/deposit', { accountId: lookup.account.id, amount });
      toast('Deposit successfully saved.');
      lookup.setNumber(''); setAmount('');
      onDone();
    } catch (err) {
      toast(err.response?.data?.message || 'Deposit failed', 'error');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 max-w-xl">
      <LookupField label="Account Number" lookup={lookup} />
      <label className="block">
        <span className="block text-sm font-medium text-slate-700 mb-1.5">Deposit Amount</span>
        <input type="number" min="0" step="any" required value={amount} onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
      </label>
      <div className="sm:col-span-2">
        <button disabled={busy} className="px-5 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-60">
          {busy ? 'Processing…' : 'Submit Deposit'}
        </button>
      </div>
    </form>
  );
}

function WithdrawForm({ onDone, toast }) {
  const lookup = useAccountLookup();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!lookup.account) return toast('Look up a valid account number first', 'warning');
    if (parseFloat(amount) > lookup.account.balance) return toast("Amount is greater than the client's balance", 'warning');
    setBusy(true);
    try {
      await api.post('/transactions/withdraw', { accountId: lookup.account.id, amount });
      toast('Withdrawal successfully saved.');
      lookup.setNumber(''); setAmount('');
      onDone();
    } catch (err) {
      toast(err.response?.data?.message || 'Withdrawal failed', 'error');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 max-w-xl">
      <LookupField label="Account Number" lookup={lookup} />
      <label className="block">
        <span className="block text-sm font-medium text-slate-700 mb-1.5">Withdraw Amount</span>
        <input type="number" min="0" step="any" required value={amount} onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
      </label>
      <div className="sm:col-span-2">
        <button disabled={busy} className="px-5 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-60">
          {busy ? 'Processing…' : 'Submit Withdrawal'}
        </button>
      </div>
    </form>
  );
}

function TransferForm({ onDone, toast }) {
  const from = useAccountLookup();
  const to = useAccountLookup();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!from.account || !to.account) return toast('Look up both accounts first', 'warning');
    if (parseFloat(amount) > from.account.balance) return toast("Amount is greater than the sender's balance", 'warning');
    setBusy(true);
    try {
      await api.post('/transactions/transfer', { fromAccountId: from.account.id, toAccountId: to.account.id, amount });
      toast('Transfer successfully processed.');
      from.setNumber(''); to.setNumber(''); setAmount('');
      onDone();
    } catch (err) {
      toast(err.response?.data?.message || 'Transfer failed', 'error');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 max-w-2xl">
      <LookupField label="From Account" lookup={from} />
      <LookupField label="To Account" lookup={to} />
      <label className="block sm:col-span-2">
        <span className="block text-sm font-medium text-slate-700 mb-1.5">Transfer Amount</span>
        <input type="number" min="0" step="any" required value={amount} onChange={(e) => setAmount(e.target.value)}
          className="w-full max-w-xs px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-600" />
      </label>
      <div className="sm:col-span-2">
        <button disabled={busy} className="px-5 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-60">
          {busy ? 'Processing…' : 'Submit Transfer'}
        </button>
      </div>
    </form>
  );
}
