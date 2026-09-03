import axiosInstance, { type NormalizedError } from "@/lib/api/client";
import type {
  PaginatedResult,
  User,
  UserStatus,
} from "@/lib/types/api";
import { AppError } from "@/lib/utils/app-error";

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
}

export interface CreateUserPayload {
  username: string;
  email?: string;
  fullName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  password: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
}

export async function getUsers(
  query: UserListQuery,
): Promise<PaginatedResult<User>> {
  try {
    const response = await axiosInstance.get("/users", { params: query });
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function getUserById(id: string): Promise<User> {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  try {
    const response = await axiosInstance.post("/users", payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<User> {
  try {
    const response = await axiosInstance.patch(`/users/${id}`, payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function updateUserStatus(
  id: string,
  status: UserStatus,
): Promise<User> {
  try {
    const response = await axiosInstance.patch(`/users/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}