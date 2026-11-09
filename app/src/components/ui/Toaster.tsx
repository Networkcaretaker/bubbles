import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import type { ToastType } from '../../stores/toastStore';

const toastStyles: Record<ToastType, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: 'border-success-500 text-success-100' },
  error: { icon: AlertCircle, className: 'border-danger-500 text-danger-100' },
  info: { icon: Info, className: 'border-accent-500 text-accent-100' },
};

// Renders toast messages. Placed once at the top of the app.
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 p-3 md:items-end"
    >
      {toasts.map((toast) => {
        const { icon: Icon, className } = toastStyles[toast.type];
        return (
          <button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg border bg-brand-900/95 px-3 py-2 text-left text-sm shadow-lg ${className}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{toast.message}</span>
          </button>
        );
      })}
    </div>
  );
}
