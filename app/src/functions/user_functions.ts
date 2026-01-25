import type { AuthUser, UserRole, RolePermissions } from '../types/user_interface'

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

export const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      operator: 'bg-green-100 text-green-800',
      driver: 'bg-yellow-100 text-yellow-800',
      developer: 'bg-gray-100 text-gray-800',
    };
    return colors[role];
};

export const ProfileInitial = (name: AuthUser['name']) => {
    const firstNameInitial = name[0];
    return firstNameInitial;
  };