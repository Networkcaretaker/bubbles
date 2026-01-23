import { CardLayout } from '../ui/Theme';

interface PlaceholderProps {
    title: string;
}

export function ContentPlaceholder({title}: PlaceholderProps) {
  const STYLE = CardLayout

  return (
    <div className="p-4">
      <div className={`${STYLE.card}`}>
        <h2 className={`${STYLE.selected_name}`}>{title}</h2>
        <p className={`${STYLE.name}`}>{title} will be managed here in the future.</p>
      </div>
    </div>
  );
}