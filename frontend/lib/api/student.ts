import axiosInstance, { type NormalizedError } from "@/lib/api/client";
import type { PaginatedResult, Student } from "@/lib/types/api";
import { AppError } from "@/lib/utils/app-error";

export interface StudentListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateStudentPayload {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export interface UpdateStudentPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
}

export async function getStudents(
  query: StudentListQuery,
): Promise<PaginatedResult<Student>> {
  try {
    const response = await axiosInstance.get("/students", { params: query });
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function getStudentById(id: string): Promise<Student> {
  try {
    const response = await axiosInstance.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function createStudent(
  payload: CreateStudentPayload,
): Promise<Student> {
  try {
    const response = await axiosInstance.post("/students", payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function updateStudent(
  id: string,
  payload: UpdateStudentPayload,
): Promise<Student> {
  try {
    const response = await axiosInstance.patch(`/students/${id}`, payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function deleteStudent(
  id: string,
): Promise<{ message: string }> {
  try {
    const response = await axiosInstance.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}
