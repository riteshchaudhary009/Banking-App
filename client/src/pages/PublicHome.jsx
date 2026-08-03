import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function PublicHome() {
  const { name } = useSettings();

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <img
            src="src/assest/logo.png"
            alt="Mission Dream Logo"
            className="h-12 w-12 rounded-2xl object-cover"
          />

          <span className="font-display text-3xl font-bold tracking-tight">
            MISSION <span className="text-orange-400">DREAM</span>
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg text-sm font-medium border border-white/20 hover:bg-white/10 transition"
          >
            Client Login
          </Link>

          <Link
            to="/admin/login"
            className="px-5 py-2 rounded-lg text-sm font-medium bg-gold-500 text-navy-900 hover:bg-gold-400 transition"
          >
            Staff Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 flex-1 grid md:grid-cols-2 items-center gap-12">
        {/* Left */}
        <div>
          <p className="text-gold-400 uppercase tracking-[0.3em] text-xs mb-4">
            Est. Digital Banking, Reimagined
          </p>

          <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Banking that reads
            <br />
            like a ledger,
            <br />
            moves like software.
          </h1>

          <p className="text-navy-200 text-lg leading-relaxed max-w-lg mb-8">
            Deposits, withdrawals and transfers—tracked to the cent,
            available the moment you need them.
          </p>

          <Link
            to="/login"
            className="inline-block px-6 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 transition"
          >
            Access My Account
          </Link>
        </div>

        {/* Right */}
        <div className="flex justify-center">
          <img
            src="src/assest/bankimg.png"
            alt="Mission Dream Banking"
            className="w-full max-w-lg object-contain"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-navy-400">
        © {new Date().getFullYear()} Mission Dream. All rights reserved.
      </footer>
    </div>
  );
}