import { useState } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { Ellipsis, LogOut } from 'lucide-react';
import { navItems } from './navigation';
import { authService } from '../../services/auth_service';

const pinnedItems = navItems.filter((item) => item.pinned);
const moreItems = navItems.filter((item) => !item.pinned);

const tabClass = (isActive: boolean) =>
  `flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
    isActive ? 'bg-brand-500/20 text-accent-300' : 'text-accent-500 hover:text-accent-100'
  }`;

const sheetItemClass = (isActive: boolean) =>
  `flex flex-col items-center justify-center gap-1 rounded-lg py-3 text-xs font-medium transition-colors ${
    isActive ? 'bg-brand-500/30 text-accent-300' : 'text-accent-400 hover:bg-brand-500/20 hover:text-accent-100'
  }`;

export function MobileNavigation() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();

  // Highlight "More" when the current page lives inside it
  const onMorePage = moreItems.some((item) => matchPath({ path: item.href, end: false }, pathname));
  const close = () => setMoreOpen(false);

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden" onClick={close} />
      )}

      <div className="relative z-30 md:hidden">
        {moreOpen && (
          <div className="absolute inset-x-0 bottom-full grid grid-cols-3 gap-2 rounded-t-2xl border-t border-accent-500 bg-brand-900/95 p-4">
            {moreItems.map((item) => (
              <NavLink key={item.href} to={item.href} onClick={close} className={({ isActive }) => sheetItemClass(isActive)}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            <button onClick={authService.signOut} className={sheetItemClass(false)}>
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <nav className="grid grid-cols-5 border-t border-accent-500 bg-gradient-to-t from-brand-900/90 to-brand-700/90 pb-[env(safe-area-inset-bottom)]">
          {pinnedItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              onClick={close}
              className={({ isActive }) => tabClass(isActive)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          <button onClick={() => setMoreOpen(!moreOpen)} className={tabClass(moreOpen || onMorePage)}>
            <Ellipsis className="h-5 w-5" />
            <span>More</span>
          </button>
        </nav>
      </div>
    </>
  );
}
