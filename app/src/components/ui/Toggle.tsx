interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// On/off switch with a label, e.g. for settings
export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-accent-50">{label}</p>
        {description && <p className="text-xs text-muted-300">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`inline-flex h-6 w-11 shrink-0 items-center justify-start rounded-full border p-0 transition-colors ${
          checked ? 'border-accent-300 bg-accent-500' : 'border-accent-500/60 bg-brand-800'
        }`}
      >
        {/* Knob: 4px from the left when off, 4px from the right when on (track is 42px inside the border) */}
        <span
          className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}
