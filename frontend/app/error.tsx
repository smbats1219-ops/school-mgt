"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Error</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message || "A runtime error occurred."}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-foreground px-4 py-2.5 font-medium text-background transition hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
