import type { UserStatus } from "@/lib/types/api";

export const studentKeys = {
  all: ["students"] as const,
  list: (params?: { page?: number; limit?: number; search?: string }) => [
    ...studentKeys.all,
    "list",
    params,
  ] as const,
  detail: (id: string) => [...studentKeys.all, "detail", id] as const,
};

export const userKeys = {
  all: ["users"] as const,
  list: (params?: { page?: number; limit?: number; search?: string; status?: UserStatus }) =>
    [...userKeys.all, "list", params] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export const roleKeys = {
  all: ["roles"] as const,
  list: (params?: Record<string, unknown>) => [...roleKeys.all, "list", params] as const,
  detail: (id: string) => [...roleKeys.all, "detail", id] as const,
};

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};