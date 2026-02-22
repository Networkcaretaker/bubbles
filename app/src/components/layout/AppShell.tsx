import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { theme } from '../styles/theme'

export function AppShell() {
  return (
    <>
      <MobileNavigation />
      <div className={`${theme.shell.layout}`}> 
        <div className={`${theme.shell.sidebar}`}>
          <Sidebar />
        </div>
        <div className={`${theme.shell.outlet}`}>
          <>
            <main>
              <Outlet />
            </main>
          </>
        </div>
      </div>
    </>
  );
}