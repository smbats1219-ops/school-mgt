import axiosInstance, { type NormalizedError } from "@/lib/api/client";
import { AppError } from "@/lib/utils/app-error";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  try {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function register(payload: RegisterPayload) {
  try {
    const response = await axiosInstance.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}

export async function fetchUserProfile() {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    throw AppError(error as NormalizedError);
  }
}