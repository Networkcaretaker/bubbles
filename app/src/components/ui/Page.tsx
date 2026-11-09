import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from './PageHeader';

interface PageProps {
  title: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
}

// Fixed header with scrolling content underneath. Fills the space the AppShell gives it.
export function Page({ title, icon, actions, children }: PageProps) {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title={title} icon={icon} actions={actions} />
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">{children}</div>
    </div>
  );
}
