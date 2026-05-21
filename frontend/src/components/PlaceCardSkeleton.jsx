export default function PlaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/50 bg-white/65 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45" aria-hidden="true">
      <div className="h-56 animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-4 p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
