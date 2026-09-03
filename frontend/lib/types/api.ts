export type UserStatus = "PENDING" | "APPROVED" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export interface RoleRef {
  id: string;
  role_key: string;
  name: string;
}

export interface UserRole {
  role: RoleRef;
}

export interface User {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  status: UserStatus;
  lastLoginAt: string | null;
  isPasswordChanged: boolean;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userRoles?: UserRole[];
}

export interface StudentClassRef {
  id: string;
  name: string;
}

export interface StudentEnrollment {
  id: string;
  academicYear: string;
  status: string;
  class: StudentClassRef | null;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  enrollments?: StudentEnrollment[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface LoggedInUser {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  status: UserStatus;
  roles: string[];
}

export interface LoginResponse {
  user: LoggedInUser;
  access_token: string;
}

export interface MeResponse {
  user: User;
  roles: string[];
}

export interface PermissionModule {
  moduleKey: string;
  name: string;
}

export interface PermissionRef {
  id: string;
  permissionKey: string;
  name: string;
  permissionModule: PermissionModule;
}

export interface Role {
  id: string;
  role_key: string;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  rolePermissions: { permission: PermissionRef }[];
}