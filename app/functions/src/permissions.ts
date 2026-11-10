// Roles and permissions.
// Keep in step with getDefaultPermissions() in app/src/functions/user_functions.ts

export const ROLES = ['owner', 'manager', 'operator', 'driver', 'developer'] as const;
export type UserRole = (typeof ROLES)[number];

export interface RolePermissions {
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewClients: boolean;
  canCreateClients: boolean;
  canEditClients: boolean;
  canDeleteClients: boolean;
}

const none: RolePermissions = {
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canViewClients: false,
  canCreateClients: false,
  canEditClients: false,
  canDeleteClients: false,
};

const all: RolePermissions = Object.fromEntries(Object.keys(none).map((key) => [key, true])) as unknown as RolePermissions;

export function getDefaultPermissions(role: UserRole): RolePermissions {
  switch (role) {
    case 'owner':
    case 'developer':
      return { ...all };
    case 'manager':
      return {
        ...none,
        canViewUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canViewClients: true,
        canCreateClients: true,
        canEditClients: true,
      };
    case 'operator':
    case 'driver':
      return {
        ...none,
        canViewUsers: true,
        canViewClients: true,
        canCreateClients: true,
        canEditClients: true,
      };
    default:
      return { ...none };
  }
}

export const isRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && (ROLES as readonly string[]).includes(value);
