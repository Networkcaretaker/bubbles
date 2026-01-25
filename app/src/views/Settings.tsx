import { Settings } from 'lucide-react';
import SettingsTabs from '../components/settings/SettingsTabs';
import { Theme } from '../components/ui/Theme';

const PAGE_TITLE = "Settings"
const PAGE_ICON = Settings

export default function View() {
  return (
    <div className={`${Theme.view.page}`}>
      <div className={`${Theme.view.header}`}>
        <div className={`${Theme.view.title}`}>
          <PAGE_ICON className="w-6 h-6" />
          <h1>{PAGE_TITLE}</h1>
        </div>
      </div>
      <div className={`${Theme.view.content}`}>
        <SettingsTabs />
      </div>
    </div>
  );
}
