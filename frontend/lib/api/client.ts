import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_BASE_URL } from "@/lib/constants";
import { clearToken, getToken } from "@/lib/utils/token";

export interface NormalizedError {
  code?: string;
  status: number;
  message?: string;
  details?: unknown;
}

const axiosInstance: AxiosInstance = axios.create({
  // Backend serves all routes under the global `/api` prefix (backend main.ts).
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Let Axios handle Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"] as unknown;
  }

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Expired/invalid session
    if (status === 401) {
      clearToken();
    }

    const data = error.response?.data as
      | {
          error?: { message?: string } | string;
          errors?: Array<{ message?: string }>;
          message?: string | string[];
          statusCode?: number;
        }
      | undefined;

    let message: string | undefined;

    if (data) {
      // NestJS HTTP exceptions: { statusCode, message, error }
      if (typeof data.message === "string") {
        message = data.message;
      } else if (Array.isArray(data.message) && data.message.length > 0) {
        message = data.message.join("; ");
      }

      // Validation errors (custom shape)
      if (
        !message &&
        Array.isArray(data.errors) &&
        data.errors.length > 0
      ) {
        message = data.errors
          .map((issue) => issue.message)
          .filter(Boolean)
          .join("; ");
      }

      // Fall back to the error type / message if present
      if (!message) {
        if (typeof data.error === "string") {
          message = data.error;
        } else if (data.error?.message) {
          message = data.error.message;
        }
      }
    }

    const normalizedError: NormalizedError = {
      code: error.code,
      status: status || 500,
      message,
      details: data,
    };

    return Promise.reject(normalizedError);
  },
);

export default axiosInstance;