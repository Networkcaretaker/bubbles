import { Users } from 'lucide-react';
import StaffList from '../components/staff/StaffList';
import { PageLayout, PageStyle } from '../components/ui/Theme';

const PAGE_TITLE = "Laundry Staff"
const PAGE_ICON = Users
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
        <StaffList />
      </div>
    </div>
  );
}