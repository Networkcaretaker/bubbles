import type { ReactNode } from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function Spinner({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-2 border-accent-400 border-t-transparent ${className}`}
    />
  );
}

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-accent-300">
      <Spinner />
      <p>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm">
      <AlertCircle className="h-8 w-8 text-danger-400" />
      <p className="text-danger-200">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-accent-500 px-4 py-2 font-medium text-accent-300 hover:bg-brand-600/50"
        >
          Try again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: LucideIcon;
  action?: ReactNode; // e.g. an "Add client" button
}

export function EmptyState({ title, message, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Icon className="h-8 w-8 text-accent-500" />
      <p className="font-medium text-accent-100">{title}</p>
      {message && <p className="text-sm text-muted-400">{message}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
