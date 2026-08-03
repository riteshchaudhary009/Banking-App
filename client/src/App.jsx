import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';

import PublicHome from './pages/PublicHome';
import ClientLogin from './pages/client/Login';
import ClientDashboard from './pages/client/Dashboard';
import ClientTransfer from './pages/client/Transfer';
import ClientTransactions from './pages/client/Transactions';
import ClientAnnouncements from './pages/client/Announcements';
import ClientProfile from './pages/client/Profile';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAccounts from './pages/admin/Accounts';
import AdminTransactions from './pages/admin/Transactions';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/login" element={<ClientLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute role="client" />}>
              <Route element={<ClientLayout />}>
                <Route path="/dashboard" element={<ClientDashboard />} />
                <Route path="/dashboard/transfer" element={<ClientTransfer />} />
                <Route path="/dashboard/transactions" element={<ClientTransactions />} />
                <Route path="/dashboard/announcements" element={<ClientAnnouncements />} />
                <Route path="/dashboard/profile" element={<ClientProfile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/accounts" element={<AdminAccounts />} />
                <Route path="/admin/transactions" element={<AdminTransactions />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
