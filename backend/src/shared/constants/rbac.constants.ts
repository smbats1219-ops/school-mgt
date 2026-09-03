export const ROLES_KEY = 'roles';

export const RoleKey = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  STAFF: 'staff',
  TRADER: 'trader',
} as const;

export type RoleKey = (typeof RoleKey)[keyof typeof RoleKey];
