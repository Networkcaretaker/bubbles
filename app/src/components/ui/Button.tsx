import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Spinner } from './States';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-accent-500 bg-gradient-to-t from-accent-700 to-accent-500 text-accent-50 hover:border-accent-300 hover:from-accent-600 hover:to-accent-400',
  secondary:
    'border-accent-500 bg-gradient-to-t from-brand-700/60 to-brand-800/60 text-accent-400 hover:border-accent-300 hover:from-brand-600/70 hover:to-brand-500/70 hover:text-accent-300',
  danger: 'border-danger-500 bg-danger-600/80 text-white hover:bg-danger-500',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  loading?: boolean; // Shows a spinner and disables the button
}

export function Button({
  variant = 'primary',
  icon: Icon,
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
