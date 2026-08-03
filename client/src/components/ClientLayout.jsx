import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from './BrandMark';

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/transfer', label: 'Transfer' },
  { to: '/dashboard/transactions', label: 'Transactions' },
  { to: '/dashboard/announcements', label: 'Announcements' },
  { to: '/dashboard/profile', label: 'Profile' },
];

export default function ClientLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <BrandMark className="text-lg" />
            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive ? 'bg-white/10 text-white' : 'text-navy-200 hover:text-white'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm leading-tight">{profile?.firstname} {profile?.lastname}</p>
              <p className="text-xs text-gold-400 font-mono">Acc_No:{profile?.accountNumber}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-sm px-3 py-1.5 rounded-md border border-white/20 hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="md:hidden flex overflow-x-auto px-4 pb-2 gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-white/10 text-white' : 'text-navy-200'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
