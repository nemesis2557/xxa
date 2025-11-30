
import { ROLE_PERMISSIONS } from '@/constants/roles';
import type { UserRole } from '@/types/auth';

export function getUserRole(dbRole: string): UserRole {
  if (dbRole === process.env.NEXT_PUBLIC_SCHEMA_ADMIN_USER || dbRole === 'app20251127214152nuwafyrxyn_v1_admin_user') {
    return 'admin';
  }
  return 'mesero';
}

export function getUserRoleFromRoleType(roleType: string): UserRole {
  const validRoles: UserRole[] = ['admin', 'mesero', 'cajero', 'chef', 'ayudante'];
  if (validRoles.includes(roleType as UserRole)) {
    return roleType as UserRole;
  }
  return 'mesero';
}

export function hasPermission(role: UserRole, permission: keyof typeof ROLE_PERMISSIONS.admin): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions[permission] : false;
}
