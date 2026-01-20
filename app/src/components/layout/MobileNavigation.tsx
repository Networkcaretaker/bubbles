import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, WashingMachine, Users } from 'lucide-react';
import { auth } from '../../services/firebase/config';

// In a larger app, you might want to move this to a shared configuration file
// to avoid duplication with the main Sidebar component.
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Template', href: '/template', icon: WashingMachine },
  { name: 'Staff', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNavigation() {
  const handleSignOut = () => {
    auth.signOut();
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cyan-800 bg-gradient-to-t from-blue-900/80 to-blue-500/90 md:hidden">
      <div className="flex h-16 justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-cyan-400 bg-blue-500/20'
                  : 'text-cyan-500 hover:bg-cyan-50/20 hover:text-cyan-100'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
        <button
          onClick={handleSignOut}
          className="flex w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors text-cyan-500 hover:bg-cyan-50/20 hover:text-cyan-100"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}