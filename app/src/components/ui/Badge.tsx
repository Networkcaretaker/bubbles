import type { ReactNode } from 'react';

export type BadgeTone = 'accent' | 'brand' | 'success' | 'warning' | 'danger' | 'muted' | 'purple';

// Full class names written out so Tailwind includes them
const toneClasses: Record<BadgeTone, string> = {
  accent: 'bg-accent-800 text-accent-300',
  brand: 'bg-brand-500/30 text-brand-200',
  success: 'bg-success-500/20 text-success-400',
  warning: 'bg-warning-500/20 text-warning-400',
  danger: 'bg-danger-500/20 text-danger-400',
  muted: 'bg-muted-500/20 text-muted-300',
  purple: 'bg-purple-500/20 text-purple-400',
};

// Small coloured label for statuses, roles and types
export function Badge({ tone = 'accent', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-block shrink-0 rounded px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

// Round initial, e.g. "J" for James
export function Avatar({ name }: { name?: string }) {
  const initial = name?.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-600 text-2xl font-light text-accent-50">
      {initial}
    </div>
  );
}
