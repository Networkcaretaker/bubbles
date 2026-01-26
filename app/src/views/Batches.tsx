import { WashingMachine } from 'lucide-react';
import { Theme } from '../components/ui/Theme';
import { ContentPlaceholder } from '../components/dev/ContentPlaceholder';

const PAGE_TITLE = "Job Batches"
const PAGE_ICON = WashingMachine

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
        <ContentPlaceholder title={PAGE_TITLE} />
      </div>
    </div>
  );
}