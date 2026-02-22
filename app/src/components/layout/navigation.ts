import { LayoutDashboard, Settings, LogOut, WashingMachine, Users, FileText } from 'lucide-react';

export const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Services', href: '/services', icon: WashingMachine },
  { name: 'Items', href: '/items', icon: WashingMachine },
  { name: 'Jobs', href: '/jobs', icon: WashingMachine },
  { name: 'Batches', href: '/batches', icon: WashingMachine },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Quotes', href: '/quotes', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Template', href: '/template', icon: Settings },
];