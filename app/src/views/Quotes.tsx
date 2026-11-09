import { FileText } from 'lucide-react';
import { Page } from '../components/ui/Page';
import { ContentPlaceholder } from '../components/dev/ContentPlaceholder';

export default function View() {
  return (
    <Page title="Quotes" icon={FileText}>
      <ContentPlaceholder title="Quotes" />
    </Page>
  );
}
