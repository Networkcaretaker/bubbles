import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

// The shell owns the screen height. Pages fill <main> and scroll inside it.
// Desktop: sidebar on the left. Mobile: bottom navigation.
export function AppShell() {
  return (
    <div className="flex h-dvh">
      <aside className="hidden md:flex md:w-64 md:shrink-0">
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
}
