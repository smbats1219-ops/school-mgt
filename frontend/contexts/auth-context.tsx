"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchUserProfile } from "@/lib/api/auth";
import { clearToken, getToken } from "@/lib/utils/token";
import type { LoggedInUser, User } from "@/lib/types/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
  sessionRoles: string[];
  setAuthState: (loggedInUser: LoggedInUser) => void;
  clearAuthState: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [sessionRoles, setSessionRoles] = useState<string[]>([]);

  const setAuthState = useCallback((loggedInUser: LoggedInUser) => {
    setUser(loggedInUser as unknown as User);
    setSessionRoles(loggedInUser.roles);
    setIsAuthenticated(true);
  }, []);

  const clearAuthState = useCallback(async () => {
    setUser(undefined);
    setSessionRoles([]);
    setIsAuthenticated(false);
    clearToken();

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/register")
    ) {
      router.replace("/login");
    }
  }, [router]);

  const restoreSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetchUserProfile();
      setUser(res.user);
      setSessionRoles(res.roles ?? []);
      setIsAuthenticated(true);
    } catch {
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthState]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        sessionRoles,
        setAuthState,
        clearAuthState,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}