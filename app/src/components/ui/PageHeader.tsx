import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  icon?: LucideIcon;
  actions?: ReactNode; // Buttons shown on the right, usually IconButtons
}

export function PageHeader({ title, icon: Icon, actions }: PageHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 bg-brand-700/40 px-3">
      <div className="flex min-w-0 items-center gap-2 text-xl font-bold text-accent-400">
        {Icon && <Icon className="h-5 w-5 shrink-0" />}
        <h1 className="truncate">{title}</h1>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
