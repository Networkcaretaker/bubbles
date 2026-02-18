import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import BubbleAnimation from './components/Background';
import { AppShell } from './components/layout/AppShell';
// Import Views
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Staff from './views/staff/Main';
import Clients from './views/clients/Main';
import ClientPage from './views/clients/Page';
import Contacts from './views/contacts/Main';
import ContactsPage from './views/contacts/Page';
import Services from './views/services/Main';
import Items from './views/items/Main';
import Jobs from './views/jobs/Main';
import JobPage from './views/jobs/Page';
import Settings from './views/Settings';
import Template from './views/template/Main';
import TemplatePage from './views/template/Page';
import Batches from './views/Batches';
import Invoices from './views/Invoices';
import Quotes from './views/Quotes';

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
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientPage />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/:id" element={<ContactsPage />} />
              <Route path="staff" element={<Staff />} />
              <Route path="services" element={<Services />} />
              <Route path="items" element={<Items />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/:id" element={<JobPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="template" element={<Template />} />
              <Route path="template/:id" element={<TemplatePage />} />
              <Route path="batches" element={<Batches />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="quotes" element={<Quotes />} />
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