import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The page you requested does not exist.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-foreground px-4 py-2.5 font-medium text-background transition hover:opacity-90"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
