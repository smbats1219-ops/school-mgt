import axiosInstance, { type NormalizedError } from "@/lib/api/client";
import type { Role } from "@/lib/types/api";
import { AppError } from "@/lib/utils/app-error";

export interface CreateRolePayload {
  role_key: string;
  name: string;
  description?: string;
  isSystemRole?: boolean;
}

export interface AssignRoleToUserPayload {
  userId: string;
  roleId: string;
}

export async function getRoles(): Promise<Role[]> {
  try {
    const response = await axiosInstance.get("/roles");
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function getRoleById(id: string): Promise<Role> {
  try {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  try {
    const response = await axiosInstance.post("/roles", payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function assignRoleToUser(payload: AssignRoleToUserPayload) {
  try {
    const response = await axiosInstance.post("/roles/assign", payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  try {
    const response = await axiosInstance.delete(`/roles/assign/${userId}/${roleId}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}