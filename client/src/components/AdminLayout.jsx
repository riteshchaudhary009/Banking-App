import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from './BrandMark';

const links = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10 3h8v5h-8v-5z' },
  { to: '/admin/accounts', label: 'Client Accounts', icon: 'M12 12a5 5 0 100-10 5 5 0 000 10zM4 22a8 8 0 0116 0' },
  { to: '/admin/transactions', label: 'Transactions', icon: 'M3 10h18M7 15h.01M11 15h4' },
  { to: '/admin/announcements', label: 'Announcements', icon: 'M11 5l-6 4H3v6h2l6 4V5zM19 8a6 6 0 010 8' },
  { to: '/admin/users', label: 'Staff Users', icon: 'M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
  { to: '/admin/settings', label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z' },
];

export default function AdminLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-navy-900 text-navy-100 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <BrandMark className="text-xl" />
          <p className="text-xs text-gold-400 tracking-[0.2em] uppercase mt-0.5">Admin Panal</p>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-navy-200 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={l.icon} /></svg>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 font-semibold text-sm overflow-hidden shrink-0">
              {profile?.avatar ? (
                <img src={`/${profile.avatar}`} alt="" className="w-full h-full object-cover" />
              ) : (
                profile?.firstname?.[0] || 'A'
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{profile?.firstname} {profile?.lastname}</p>
              <p className="text-xs text-navy-300">@{profile?.username}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="mt-2 w-full text-left px-3 py-2 rounded-lg text-sm text-navy-200 hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
