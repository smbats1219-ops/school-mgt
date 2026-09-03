import { ACCESS_TOKEN_KEY } from "@/lib/constants";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}