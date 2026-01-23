import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './views/Login';
import BubbleAnimation from './components/Background';
import { AppShell } from './components/layout/AppShell';
import Dashboard from './views/Dashboard';
import Settings from './views/Settings';
import Staff from './views/Staff';
import Jobs from './views/Jobs';
import Client from './views/Clients';

// ... ProtectedRoute component ...
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full min-h-screen">
        {/* Bubble animation as continuous background */}
        <div className="fixed inset-0 z-0">
          <BubbleAnimation />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="client" element={<Client />} />
              <Route path="staff" element={<Staff />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/users" element={<h1 className="text-2xl font-bold text-cyan-500">Users</h1>} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;