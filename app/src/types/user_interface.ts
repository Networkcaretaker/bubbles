import type { Timestamp } from './shared_interface'

export type UserRole = 
  | 'owner'
  | 'manager'
  | 'operator'
  | 'driver'
  | 'developer';

export interface RolePermissions {
  // Staff Management
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  // Client Management
  canViewClients: boolean;
  canCreateClients: boolean;
  canEditClients: boolean;
  canDeleteClients: boolean;
}

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions?: RolePermissions;
  timestamp?: Timestamp;
}
