import axiosInstance, { type NormalizedError } from "@/lib/api/client";
import type { PaginatedResult, Teacher } from "@/lib/types/api";
import { AppError } from "@/lib/utils/app-error";

export interface TeacherListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateTeacherPayload {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateTeacherPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export async function getTeachers(
  query: TeacherListQuery,
): Promise<PaginatedResult<Teacher>> {
  try {
    const response = await axiosInstance.get("/teachers", { params: query });
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function getTeacherById(id: string): Promise<Teacher> {
  try {
    const response = await axiosInstance.get(`/teachers/${id}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function createTeacher(
  payload: CreateTeacherPayload,
): Promise<Teacher> {
  try {
    const response = await axiosInstance.post("/teachers", payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function updateTeacher(
  id: string,
  payload: UpdateTeacherPayload,
): Promise<Teacher> {
  try {
    const response = await axiosInstance.patch(`/teachers/${id}`, payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function deleteTeacher(
  id: string,
): Promise<{ message: string }> {
  try {
    const response = await axiosInstance.delete(`/teachers/${id}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}
