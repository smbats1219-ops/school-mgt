"use client";

import {
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student", label: "Student", icon: Boxes },
  // { href: "/suppliers", label: "Suppliers", icon: Truck },
  // { href: "/traders", label: "Traders", icon: BriefcaseBusiness },
];

const adminNav: NavItem[] = [
  { href: "/users", label: "Users", icon: Users },
  { href: "/roles", label: "Roles", icon: ShieldCheck },
];

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, clearAuthState } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </main>
    );
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  function handleLogout() {
    clearAuthState();
    toast.success("Signed out");
    router.push("/login");
  }

  const navSections = [
    { title: "Operations", items: mainNav },
    { title: "Administration", items: adminNav },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-foreground text-sm font-bold text-background">
            IL
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              InvLedger
            </p>
            <p className="text-sm font-semibold text-foreground">Operations</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map(({ href, label, icon: Icon }) => {
                  const active =
                    pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold text-foreground">
              {user?.fullName
                ? user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "U"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {user?.fullName ?? user?.username}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? user?.username}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-5 backdrop-blur-sm md:hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <BarChart3 className="size-4" />
            InvLedger
          </Link>
        </header>
        <main className="flex-1 px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
