import { useEffect } from 'react';
import { useConfirmStore } from '../../stores/confirmStore';

// Renders the dialog opened by confirmDialog(). Placed once at the top of the app.
export function ConfirmDialog() {
  const request = useConfirmStore((state) => state.request);
  const close = useConfirmStore((state) => state.close);

  useEffect(() => {
    if (!request) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [request, close]);

  if (!request) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => close(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm space-y-3 rounded-xl border border-accent-500 bg-gradient-to-r from-brand-900 to-brand-700 p-4"
      >
        <h2 id="confirm-title" className="text-lg font-bold text-accent-50">
          {request.title}
        </h2>
        {request.message && <p className="text-sm text-accent-100">{request.message}</p>}
        <div className="flex justify-end gap-2 pt-2">
          {/* For risky actions, focus starts on Cancel so Enter doesn't delete by accident */}
          <button
            type="button"
            autoFocus={request.danger}
            onClick={() => close(false)}
            className="rounded-md border border-accent-500 px-4 py-2 text-sm font-medium text-accent-300 hover:bg-brand-600/50"
          >
            {request.cancelLabel ?? 'Cancel'}
          </button>
          <button
            type="button"
            autoFocus={!request.danger}
            onClick={() => close(true)}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
              request.danger ? 'bg-danger-600 hover:bg-danger-500' : 'bg-accent-600 hover:bg-accent-500'
            }`}
          >
            {request.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
