import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ClientDetailPage from './pages/ClientDetailPage.jsx';
import MatchHistoryGlobalPage from './pages/MatchHistoryGlobalPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* Toaster lives outside Routes so it persists across navigations */}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '14px',
            background: '#FFFFFF',
            border: '1px solid #E8E1D6',
            color: '#2C2420',
            boxShadow: '0 8px 28px rgba(44,36,32,0.12)',
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ClientDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MatchHistoryGlobalPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
