import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency, formatDate, TX_TYPES } from '../../utils/format';

export default function ClientTransactions() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/transactions/me');
      setTx(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-900">Transaction History</h1>
        <p className="text-slate-500 mt-1">A full record of activity on your account.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3">Date</th>
              <th className="px-2 py-3">Type</th>
              <th className="px-2 py-3">Remarks</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading…</td></tr>}
            {!loading && tx.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No transactions yet.</td></tr>}
            {tx.map((t) => (
              <tr key={t._id} className="border-b border-slate-50 last:border-0">
                <td className="px-6 py-3 text-slate-500">{formatDate(t.dateCreated)}</td>
                <td className="px-2 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 font-medium">{TX_TYPES[t.type]}</span></td>
                <td className="px-2 py-3 text-navy-900">{t.remarks}</td>
                <td className="px-6 py-3 text-right font-mono text-navy-900">{formatCurrency(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
