import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const SettingsContext = createContext({ name: 'Mission Dream', shortName: 'MD', logo: '', cover: '' });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ name: 'Mission Dream', shortName: 'MD', logo: '', cover: '' });

  async function refresh() {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
    } catch {
      // fall back to defaults if the API isn't reachable yet
    }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
