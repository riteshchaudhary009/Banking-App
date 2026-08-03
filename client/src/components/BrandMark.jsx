import { useSettings } from '../context/SettingsContext';

export default function BrandMark({ dark, className = '' }) {
  const { shortName, logo } = useSettings();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo ? `/${logo}` : "src/assest/logo.png"}
        alt={shortName || "Logo"}
        className="h-10 w-10 rounded-2xl object-cover"
      />

      <span
        className={`font-display tracking-tight text-xl font-bold ${
          dark ? 'text-navy-900' : 'text-white'
        }`}
      >
        {shortName || 'MISSION DREAM'}
      </span>
    </div>
  );
}