import { LayoutDashboard } from 'lucide-react';
import { Page } from '../components/ui/Page';
import { ContentPlaceholder } from '../components/dev/ContentPlaceholder';

export default function View() {
  return (
    <Page title="Dashboard" icon={LayoutDashboard}>
      <ContentPlaceholder title="Dashboard" />
    </Page>
  );
}
