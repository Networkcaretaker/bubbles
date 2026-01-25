import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, WashingMachine, Users } from 'lucide-react';
import { auth } from '../../services/firebase/config';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: WashingMachine },
  { name: 'Jobs', href: '/jobs', icon: Users },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-t from-blue-900/80 to-blue-500/90 border-r border-cyan-500 w-64">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 h-16">
        <div className="h-12 w-12">
          <img src="/logo.png" />
        </div>
        <span className=" text-cyan-50 font-thin font-bubble text-3xl">BUBBLES</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-cyan-500/50 text-cyan-100'
                  : 'text-cyan-100 hover:bg-cyan-200/50 hover:text-cyan-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 ">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-cyan-50 rounded-md bg-cyan-500/50 hover:bg-cyan-600/50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}