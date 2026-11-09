import { create } from 'zustand';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean; // Red confirm button, e.g. for deletes
}

interface ConfirmRequest extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

interface ConfirmState {
  request: ConfirmRequest | null;
  open: (options: ConfirmOptions) => Promise<boolean>;
  close: (confirmed: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  request: null,
  open: (options) =>
    new Promise<boolean>((resolve) => {
      get().request?.resolve(false); // Cancel any dialog already open
      set({ request: { ...options, resolve } });
    }),
  close: (confirmed) => {
    get().request?.resolve(confirmed);
    set({ request: null });
  },
}));

// Ask before doing something. Resolves true if the user confirms.
//   if (await confirmDialog({ title: 'Delete client?', danger: true })) { ... }
export const confirmDialog = (options: ConfirmOptions) => useConfirmStore.getState().open(options);
