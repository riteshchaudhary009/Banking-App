import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, TX_TYPES } from '../../utils/format';

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/transactions/me');
      setTx(data.slice(0, 6));
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-navy-900 rounded-2xl p-8 text-white relative overflow-hidden">
          <p className="text-navy-300 text-xs uppercase tracking-[0.2em] mb-2">Available Balance</p>
          <p className="font-display text-5xl mb-1">{formatCurrency(profile?.balance)}</p>
          
          <div className="mt-6 flex gap-3">
            <Link to="/dashboard/transfer" className="px-4 py-2 rounded-lg bg-gold-500 text-navy-900 text-sm font-medium hover:bg-gold-400">Transfer Funds</Link>
            <Link to="/dashboard/transactions" className="px-4 py-2 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/10">View History</Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Account Holder</p>
          <p className="font-display text-lg text-navy-900">Client-Name : {profile?.lastname}, {profile?.firstname} {profile?.middlename}</p>
          <p className="text-sm text-slate-500 mt-1">Client-Email : {profile?.email}</p>
          <p className="text-navy-300 text-sm font-mono">Account-No : {profile?.accountNumber}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display text-lg text-navy-900">Recent Activity</h2>
          <Link to="/dashboard/transactions" className="text-sm text-navy-600 hover:underline">View all</Link>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {loading && <tr><td className="px-6 py-6 text-slate-400" colSpan={3}>Loading…</td></tr>}
            {!loading && tx.length === 0 && <tr><td className="px-6 py-6 text-slate-400" colSpan={3}>No transactions yet.</td></tr>}
            {tx.map((t) => (
              <tr key={t._id} className="border-b border-slate-50 last:border-0">
                <td className="px-6 py-3 text-slate-500">{formatDate(t.dateCreated)}</td>
                <td className="px-2 py-3 text-navy-900">{t.remarks}</td>
                <td className="px-6 py-3 text-right font-mono text-navy-900">
                  {t.type === 1 ? '+' : '-'}{formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
