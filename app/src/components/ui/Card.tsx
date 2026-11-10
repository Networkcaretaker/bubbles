import type { ComponentType, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const panelClass =
  'rounded-xl border border-accent-500 bg-gradient-to-r from-brand-900/80 to-brand-500/90 p-3 transition-colors hover:border-accent-300';

// Plain card-styled box, e.g. for filters or a form
export function Panel({ children }: { children: ReactNode }) {
  return <div className={panelClass}>{children}</div>;
}

interface CardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  avatar?: ReactNode; // Usually <Avatar name={...} />
  badge?: ReactNode; // Usually <Badge>...</Badge>, shown on the right
  expanded?: boolean;
  onToggle?: () => void; // When set, tapping the header expands/collapses the card
  children?: ReactNode; // Card body. On a collapsible card it only shows when expanded.
}

export function Card({ title, subtitle, avatar, badge, expanded = false, onToggle, children }: CardProps) {
  const collapsible = Boolean(onToggle);
  const showBody = Boolean(children) && (!collapsible || expanded);

  const header = (
    <>
      {avatar}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-white ${expanded ? 'text-lg font-bold' : 'font-medium'}`}>{title}</p>
        {subtitle && <p className="truncate text-xs font-medium text-accent-300">{subtitle}</p>}
      </div>
      {badge}
      {collapsible && (
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-accent-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      )}
    </>
  );

  return (
    <div className={panelClass}>
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex w-full items-center gap-2 text-left"
        >
          {header}
        </button>
      ) : (
        <div className="flex items-center gap-2">{header}</div>
      )}
      {showBody && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

// A titled block inside a card, e.g. "Client Jobs"
export function CardSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-2 text-xs text-accent-50">
      {title && <p className="text-sm font-medium text-accent-400">{title}</p>}
      {children}
    </div>
  );
}

// Icon + text line, e.g. phone number or email
export function DetailRow({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3 w-3 shrink-0" />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

// Row of buttons along the bottom of a card
export function CardActions({ children }: { children: ReactNode }) {
  return <div className="flex gap-1">{children}</div>;
}

type CardActionProps = {
  icon: ComponentType<{ className?: string }>; // Lucide icon or a custom one like WhatsApp
  label: string;
} & (
  | { to: string; href?: never; onClick?: never } // Page inside the app
  | { href: string; to?: never; onClick?: never } // Phone, email or external link
  | { onClick: () => void; disabled?: boolean; to?: never; href?: never }
);

const actionClass =
  'flex flex-1 items-center justify-center rounded-md border border-accent-500 bg-gradient-to-t from-brand-700/60 to-brand-800/60 p-2 text-accent-500 transition-colors hover:border-accent-300 hover:from-brand-600/70 hover:to-brand-500/70 hover:text-accent-300';

export function CardAction(props: CardActionProps) {
  const { icon: Icon, label, to, href, onClick } = props;
  const disabled = 'disabled' in props ? props.disabled : false;
  const content = <Icon className="h-6 w-6" />;

  if (to) {
    return (
      <Link to={to} title={label} aria-label={label} className={actionClass}>
        {content}
      </Link>
    );
  }
  if (href) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        title={label}
        aria-label={label}
        className={actionClass}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`${actionClass} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {content}
    </button>
  );
}
