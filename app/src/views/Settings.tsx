import { Settings as SettingsIcon } from 'lucide-react';
import { Page } from '../components/ui/Page';
import SettingsTabs from '../components/settings/SettingsTabs';

export default function Settings() {
  return (
    <Page title="Settings" icon={SettingsIcon}>
      <SettingsTabs />
    </Page>
  );
}
