import { Receipt } from 'lucide-react';
import { Page } from '../components/ui/Page';
import { ContentPlaceholder } from '../components/dev/ContentPlaceholder';

export default function View() {
  return (
    <Page title="Invoices" icon={Receipt}>
      <ContentPlaceholder title="Invoices" />
    </Page>
  );
}
