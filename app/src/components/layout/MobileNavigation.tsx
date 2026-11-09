import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LogOut,  
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { auth } from '../../services/firebase/config';
import { navigation } from './navigation'
// import { theme } from '../styles/theme'

export function MobileNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSignOut = () => {
    auth.signOut();
  };

  // Combine nav items and the sign-out button into one array for the grid
  const allActions = [...navigation];

  return (
    <>
      {/* Backdrop to close the menu when tapping outside */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden" 
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div 
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-accent-500 bg-gradient-to-t from-brand-900/90 to-brand-700/90 transition-all duration-300 ease-in-out md:hidden ${
          isExpanded ? 'max-h-80 pb-6' : 'max-h-20'
        }`}
      >
        {/* Pull Handle / Toggle Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-6 w-full items-center justify-center text-accent-500/50 hover:text-accent-400"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-y-4 px-2 pb-4">
          {allActions.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsExpanded(false)}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2 mb-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-accent-400 bg-brand-500/20 rounded-lg'
                    : 'text-accent-500 hover:text-accent-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate w-full text-center">{item.name}</span>
            </NavLink>
          ))}

          {/* Sign Out Button always at the end */}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors text-accent-500 hover:text-accent-100"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}