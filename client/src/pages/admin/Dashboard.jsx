import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { formatCurrency, formatDate, TX_TYPES } from '../../utils/format';

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, t] = await Promise.all([api.get('/accounts'), api.get('/transactions')]);
      setAccounts(a.data);
      setTx(t.data.slice(0, 8));
      setLoading(false);
    })();
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const stats = [
    { label: 'Total Client Accounts', value: accounts.length, suffix: '' },
    { label: 'Total Deposits Held', value: formatCurrency(totalBalance), suffix: '', currency: true },
    { label: 'Transactions Logged', value: tx.length ? '500+' : tx.length, suffix: '' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-navy-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of client accounts and recent activity.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/transactions" className="px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800">New Transaction</Link>
          <Link to="/admin/accounts" className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50">Add Account</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">{s.label}</p>
            <p className={`text-3xl text-navy-900 ${s.currency ? 'font-mono' : 'font-display'}`}>{s.money && ''}{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-display text-lg text-navy-900">Recent Transactions</h2>
            <Link to="/admin/transactions" className="text-sm text-navy-600 hover:underline">View all</Link>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {loading && <tr><td className="px-6 py-6 text-slate-400" colSpan={4}>Loading…</td></tr>}
              {!loading && tx.length === 0 && <tr><td className="px-6 py-6 text-slate-400" colSpan={4}>No transactions yet.</td></tr>}
              {tx.map((t) => (
                <tr key={t._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-3 text-slate-500">{formatDate(t.dateCreated)}</td>
                  <td className="px-2 py-3 text-navy-900">{t.account ? `${t.account.lastname}, ${t.account.firstname}` : '—'}</td>
                  <td className="px-2 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 font-medium">{TX_TYPES[t.type]}</span>
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-navy-900">{formatCurrency(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-display text-lg text-navy-900 mb-4">Top Balances</h2>
          <div className="space-y-3">
            {[...accounts].sort((a, b) => b.balance - a.balance).slice(0, 6).map((a) => (
              <div key={a._id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-navy-900 truncate">{a.lastname}, {a.firstname}</p>
                  <p className="text-xs text-slate-400 font-mono">{a.accountNumber}</p>
                </div>
                <span className="font-mono text-sm text-navy-900 shrink-0">{formatCurrency(a.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
