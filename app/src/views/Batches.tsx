import { Layers } from 'lucide-react';
import { Page } from '../components/ui/Page';
import { ContentPlaceholder } from '../components/dev/ContentPlaceholder';

export default function View() {
  return (
    <Page title="Job Batches" icon={Layers}>
      <ContentPlaceholder title="Job Batches" />
    </Page>
  );
}
