import { WashingMachine } from 'lucide-react';
import { PageLayout, PageStyle } from '../components/ui/Theme';
import { ContentPlaceholder } from '../components/dev/ContentPlaceholder';

const PAGE_TITLE = "Laundry Jobs"
const PAGE_ICON = WashingMachine
const LAYOUT = PageLayout
const STYLE = PageStyle

export default function View() {
  return (
    <div className={`${LAYOUT.page}`}>
      <div className={`${LAYOUT.header} ${STYLE.header}`}>
        <div className={`${LAYOUT.title}`}>
          <PAGE_ICON className={`${STYLE.title_icon}`} />
          <h1 className={`${STYLE.title_text}`}>{PAGE_TITLE}</h1>
        </div>
      </div>
      <div className={`${LAYOUT.content}`}>
        <ContentPlaceholder title={PAGE_TITLE} />
      </div>
    </div>
  );
}