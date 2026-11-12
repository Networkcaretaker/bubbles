import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import BubbleAnimation from './components/Background';
import { AppShell } from './components/layout/AppShell';
import { Toaster } from './components/ui/Toaster';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
// Import Views
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Users from './views/users/Main';
import UserPage from './views/users/Page';
import Profile from './views/users/Profile';
import Clients from './views/clients/Main';
import ClientPage from './views/clients/Page';
import ClientJobs from './views/client-jobs/Main';
import ClientJobPage from './views/client-jobs/Page';
import Contacts from './views/contacts/Main';
import ContactsPage from './views/contacts/Page';
import Services from './views/services/Main';
import ServicePage from './views/services/Page';
import Items from './views/items/Main';
import ItemPage from './views/items/Page';
import WorkOrders from './views/work-orders/Main';
import WorkOrderPage from './views/work-orders/Page';
import Settings from './views/Settings';
import SimpleMain from './views/simple/Main';
import SimplePage from './views/simple/Page';
import { batchesSection, invoicesSection, quotesSection, templatesSection } from './views/simple/sections';

// Basic named collections share one list page and one detail page
const simpleSections = [batchesSection, quotesSection, invoicesSection, templatesSection];


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
              <Route path="client-jobs" element={<ClientJobs />} />
              <Route path="client-jobs/:id" element={<ClientJobPage />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/:id" element={<ContactsPage />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<UserPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="staff" element={<Navigate to="/users" replace />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:id" element={<ServicePage />} />
              <Route path="items" element={<Items />} />
              <Route path="items/:id" element={<ItemPage />} />
              <Route path="work-orders" element={<WorkOrders />} />
              <Route path="work-orders/:id" element={<WorkOrderPage />} />
              <Route path="jobs/*" element={<Navigate to="/work-orders" replace />} />
              <Route path="settings" element={<Settings />} />
              {simpleSections.flatMap((section) => [
                <Route key={section.path} path={section.path.slice(1)} element={<SimpleMain key={section.path} config={section} />} />,
                <Route key={`${section.path}/:id`} path={`${section.path.slice(1)}/:id`} element={<SimplePage key={section.path} config={section} />} />,
              ])}
              <Route path="settings/users" element={<Navigate to="/settings?tab=users" replace />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster />
        <ConfirmDialog />
      </div>
    </BrowserRouter>
  );
}

export default App;