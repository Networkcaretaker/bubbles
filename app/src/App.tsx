import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import BubbleAnimation from './components/Background';
import { AppShell } from './components/layout/AppShell';

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
              <Route index element={<h1 className="text-2xl font-bold text-blue-300">Dashboard</h1>} />
              <Route path="settings" element={<h1 className="text-2xl font-bold text-blue-300">Settings</h1>} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;