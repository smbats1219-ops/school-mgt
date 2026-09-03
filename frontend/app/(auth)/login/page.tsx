"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { login } from "@/lib/api/auth";
import { loginSchema, type LoginSchemaType } from "@/lib/validators/auth";
import { setToken } from "@/lib/utils/token";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthState } = useAuth();
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [notApproved, setNotApproved] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginSchemaType) {
    setLoginError(undefined);
    setNotApproved(false);
    try {
      const result = await login(values);
      setToken(result.access_token);
      setAuthState(result.user);
      toast.success("Signed in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to sign in.";
      setLoginError(msg);
      setNotApproved(
        msg.toUpperCase().includes("NOT APPROVED") ||
          msg.toUpperCase().includes("APPROVED") ||
          msg.toUpperCase().includes("CONTACT THE ADMINISTRATOR"),
      );
    }
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden border-r border-border bg-muted/40 p-12 text-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-20 -top-20 size-72 rounded-full border border-border bg-white/80" />
        <div className="absolute bottom-14 right-10 size-40 rounded-full border border-border bg-white/80" />
        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-muted-foreground">
            InvLedger
          </p>
          <h1 className="mt-24 max-w-lg text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground">
            Clarity for every moving part.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-muted-foreground">
            A calm command center for the people, records, and decisions behind
            your inventory.
          </p>
        </div>
        <p className="relative text-sm text-muted-foreground">
          Inventory operations, made human.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-[0_18px_40px_rgba(15,23,42,0.04)] sm:p-10">
          <div className="mb-8">
            <div className="mb-6 flex size-11 items-center justify-center rounded-lg bg-muted text-foreground ring-1 ring-border">
              <KeyRound className="size-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Sign in to InvLedger
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your username or email to continue.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin"
                        autoComplete="username"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError ? (
                <div
                  role="alert"
                  className={
                    notApproved
                      ? "flex items-center gap-3 rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                      : "flex items-center gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  }
                >
                  {notApproved && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-base">
                      ⏳
                    </span>
                  )}
                  <span>{loginError}</span>
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                size="lg"
                className="h-11 w-full"
              >
                {form.formState.isSubmitting ? (
                  "Signing in..."
                ) : (
                  <>
                    Continue <ArrowRight />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}