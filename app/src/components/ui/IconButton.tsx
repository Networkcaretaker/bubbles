import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string; // Shown as a tooltip and read by screen readers
  active?: boolean;
}

export function IconButton({ icon: Icon, label, active = false, className = '', ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`rounded-md p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? 'bg-accent-600/60 text-accent-50'
          : 'bg-accent-800/50 text-accent-400 hover:bg-accent-700/50 hover:text-accent-200'
      } ${className}`}
      {...props}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
