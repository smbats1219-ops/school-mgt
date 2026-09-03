export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-2xl border border-border bg-card px-8 py-6 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          <span className="font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}
