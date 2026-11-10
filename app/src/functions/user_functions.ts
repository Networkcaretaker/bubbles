import type { UserRole, RolePermissions } from '../types/user_interface'
import type { BadgeTone } from '../components/ui/Badge'

// Helper function to get default permissions based on role
export function getDefaultPermissions(role: UserRole): RolePermissions {
  const basePermissions: RolePermissions = {
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewClients: false,
    canCreateClients: false,
    canEditClients: false,
    canDeleteClients: false
  };

  switch (role) {
    case 'owner':
      // Owner has all permissions
      return Object.keys(basePermissions).reduce((acc, key) => {
        acc[key as keyof RolePermissions] = true;
        return acc;
      }, {} as RolePermissions);

    case 'manager':
      return {
        ...basePermissions,
        canViewUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canViewClients: true,
        canCreateClients: true,
        canEditClients: true,
      };

    case 'operator':
      return {
        ...basePermissions,
        canViewUsers: true,
        canViewClients: true,
        canCreateClients: true,
        canEditClients: true,
      };

    case 'driver':
      return {
        ...basePermissions,
        canViewUsers: true,
        canViewClients: true,
        canCreateClients: true,
        canEditClients: true,
      };

    case 'developer':
      return {
        ...basePermissions,
        canViewUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canViewClients: true,
        canCreateClients: true,
        canEditClients: true,
        canDeleteClients: true
      };

    default:
      return basePermissions;
  }
};

// Role names and badge colours for lists, forms and filters
export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'operator', label: 'Operator' },
  { value: 'driver', label: 'Driver' },
  { value: 'developer', label: 'Developer' },
];

export const ROLE_TONES: Record<UserRole, BadgeTone> = {
  owner: 'purple',
  manager: 'brand',
  operator: 'success',
  driver: 'warning',
  developer: 'muted',
};

export const roleLabel = (role: UserRole) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

// Saved permissions, or the role's defaults for older records that don't have any
export const permissionsFor = (user: { role: UserRole; permissions?: RolePermissions }): RolePermissions =>
  user.permissions ?? getDefaultPermissions(user.role);

// Used by older sections; new screens use <Avatar name={...} />
export const ProfileInitial = (name: string) => name[0];
