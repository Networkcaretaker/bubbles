import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { navigation } from './navigation';
import { authService } from '../../services/auth_service';
import { useAuthStore } from '../../stores/authStore';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-accent-50 transition-colors hover:bg-accent-500/50 ${
    isActive ? 'bg-accent-500/50' : ''
  }`;

export function Sidebar() {
  const email = useAuthStore((state) => state.user?.email);

  return (
    <div className="flex h-full w-full flex-col border-r border-accent-500 bg-gradient-to-t from-brand-900/80 to-brand-500/90 p-4">
      <div className="mb-6 flex items-center gap-2 px-3">
        <img src="/logo.png" alt="" className="h-8 w-8" />
        <span className="font-bubble text-2xl text-accent-50">Bubbles</span>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto">
        {navigation.map((group, index) => (
          <div key={group.title ?? index} className="space-y-1">
            {group.title && (
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-accent-300/70">
                {group.title}
              </p>
            )}
            {group.items.map((item) => (
              <NavLink key={item.href} to={item.href} end={item.href === '/'} className={linkClass}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-4 space-y-1 border-t border-accent-500/40 pt-4">
        {email && <p className="truncate px-3 pb-1 text-xs text-accent-200">{email}</p>}
        <button onClick={authService.signOut} className={`${linkClass({ isActive: false })} w-full`}>
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
