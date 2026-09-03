"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-context";
import NextQueryClientProvider from "@/providers/NextQueryClientProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light" forcedTheme="light">
      <AuthProvider>
        <NextQueryClientProvider>
          {children}
          <Toaster position="top-right" />
        </NextQueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}