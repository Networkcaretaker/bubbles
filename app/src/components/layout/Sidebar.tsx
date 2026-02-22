import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, WashingMachine, Users, FileText } from 'lucide-react';
import { auth } from '../../services/firebase/config';
import { navigation } from './navigation'
import { theme } from '../styles/theme'

export function Sidebar() {
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className={`${theme.sidebar.layout}`}>
      <nav className={`${theme.sidebar.navigation}`}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `${theme.sidebar.navlink} ${
                isActive
                  ? `${theme.sidebar.active}`
                  : ''
              }`
            }
          >
            <item.icon className={`${theme.icon.md}`} />
            <p className={`${theme.text.sidebar}`}>{item.name}</p>
          </NavLink>
        ))}
      </nav>
      <div>
        <button
          onClick={handleSignOut}
          className={`${theme.sidebar.navlink} w-full`}
        >
          <LogOut className={`${theme.icon.md}`} />
          <p className={`${theme.text.sidebar}`}>Sign Out</p>
        </button>
      </div>
    </div>
  );
}