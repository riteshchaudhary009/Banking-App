import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatDate } from '../../utils/format';

export default function ClientAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/announcements');
      setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-navy-900">Announcements</h1>
        <p className="text-slate-500 mt-1">Updates and news from Meridian Bank.</p>
      </div>
      <div className="grid gap-4">
        {loading && <p className="text-slate-400">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-slate-400">No announcements at this time.</p>}
        {items.map((a) => (
          <div key={a._id} className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-display text-lg text-navy-900">{a.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">{formatDate(a.dateCreated)}</p>
            <div className="prose prose-sm max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: a.announcement }} />
          </div>
        ))}
      </div>
    </div>
  );
}
