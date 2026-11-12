import { useSearchParams } from 'react-router-dom';
import { Activity, Sparkles } from 'lucide-react';
import { Section } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { EmptyState } from '../ui/States';
import { useSettingsStore } from '../../stores/settingsStore';
import DataExport from './DataExport';

const TABS = [
  { id: 'general', name: 'General' },
  { id: 'users', name: 'Users' },
  { id: 'data', name: 'Data' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function GeneralSettings() {
  const backgroundAnimation = useSettingsStore((state) => state.backgroundAnimation);
  const setBackgroundAnimation = useSettingsStore((state) => state.setBackgroundAnimation);

  return (
    <Section title="Appearance">
      <Toggle
        label="Background animation"
        description="Moving bubbles behind the app. Turn off to save battery on slower devices. Saved on this device only."
        checked={backgroundAnimation}
        onChange={setBackgroundAnimation}
      />
      <p className="flex items-center gap-1 pt-1 text-muted-300">
        <Sparkles className="h-3 w-3" /> More general settings will be added here.
      </p>
    </Section>
  );
}

// Placeholder until activity logging is built
function UserSettings() {
  return (
    <Section title="User activity">
      <EmptyState
        icon={Activity}
        title="User activity is coming soon"
        message="This will show who added, changed or deleted records, and when, with filters by user and date."
      />
    </Section>
  );
}

export default function SettingsTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('tab');
  const activeTab: TabId = TABS.some((tab) => tab.id === requested) ? (requested as TabId) : 'general';

  return (
    <div className="space-y-2">
      {/* Tabs (the chosen tab is kept in the address, e.g. /settings?tab=data) */}
      <nav className="flex border-b border-accent-500/50" aria-label="Settings tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSearchParams({ tab: tab.id }, { replace: true })}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === tab.id
                ? 'border-accent-400 bg-brand-700/30 text-accent-300'
                : 'border-transparent text-accent-500 hover:border-accent-300 hover:text-accent-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'users' && <UserSettings />}
      {activeTab === 'data' && <DataExport />}
    </div>
  );
}
