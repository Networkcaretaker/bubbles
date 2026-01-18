import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Settings } from 'lucide-react';
import UserList from '../components/settings/users/UserList';

// A placeholder for the future General settings component
function GeneralSettingsPlaceholder() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
      <p className="text-gray-500">General application settings will be managed here in the future.</p>
    </div>
  );
}
/*
function UserSettingsPlaceholder() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">User Settings</h2>
      <p className="text-gray-500">User settings will be managed here in the future.</p>
    </div>
  );
}
*/
export default function SettingsPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'general' | 'users'>(() => {
    const tab = searchParams.get('tab');
    return (tab === 'general' || tab === 'users') ? tab : 'general';
  });
  //const [isDirty, setIsDirty] = useState(false);
  //const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);
  //const [pendingTab, setPendingTab] = useState<'general' | 'users' | null>(null);

  const tabs = [
    { id: 'general', name: 'General' },
    { id: 'users', name: 'Users' },
  ];

  const handleTabClick = (tabId: 'general' | 'users') => {
    if (activeTab === tabId) return;
    setActiveTab(tabId);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-blue-800/40 p-4">
        <div className="flex items-center gap-2 ">
            <Settings className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-cyan-500 uppercase">Settings</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="border-b border-cyan-200 mb-4">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as 'general' | 'users')}
                className={`${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400 bg-blue-700/20'
                    : 'border-transparent text-cyan-400 hover:text-cyan-500 hover:border-cyan-300 bg-blue-900/20'
                }  py-3 px-6 border-b-2 font-medium text-sm transition-colors`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'general' && <GeneralSettingsPlaceholder />}
          {activeTab === 'users' && <UserList />}
        </div>
      </div>
    </div>
  );
}
