import { WashingMachine } from 'lucide-react';
import { Theme } from '../../components/ui/Theme';
import List from './List';

const PAGE_TITLE = "Laundry Items"
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
        <List />
      </div>
    </div>
  );
}