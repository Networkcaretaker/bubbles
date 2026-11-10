import {
  LayoutDashboard,
  ClipboardList,
  Layers,
  Building2,
  Contact,
  FileText,
  Receipt,
  WashingMachine,
  Shirt,
  UserCog,
  Settings,
  LayoutTemplate,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  pinned?: boolean; // Always visible in the mobile bottom bar (keep to 4)
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

// Single source for the sidebar and the mobile navigation
export const navigation: NavGroup[] = [
  {
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard, pinned: true },
    ],
  },
  {
    title: 'Work',
    items: [
      { name: 'Jobs', href: '/jobs', icon: ClipboardList, pinned: true },
      { name: 'Batches', href: '/batches', icon: Layers },
    ],
  },
  {
    title: 'Customers',
    items: [
      { name: 'Clients', href: '/clients', icon: Building2, pinned: true },
      { name: 'Contacts', href: '/contacts', icon: Contact },
    ],
  },
  {
    title: 'Billing',
    items: [
      { name: 'Quotes', href: '/quotes', icon: FileText },
      { name: 'Invoices', href: '/invoices', icon: Receipt, pinned: true },
    ],
  },
  {
    title: 'Setup',
    items: [
      { name: 'Services', href: '/services', icon: WashingMachine },
      { name: 'Items', href: '/items', icon: Shirt },
      { name: 'Users', href: '/users', icon: UserCog },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
  // Only shown when running locally (npm run dev)
  ...(import.meta.env.DEV
    ? [{ title: 'Developer', items: [{ name: 'Template', href: '/template', icon: LayoutTemplate }] }]
    : []),
];

export const navItems: NavItem[] = navigation.flatMap((group) => group.items);
