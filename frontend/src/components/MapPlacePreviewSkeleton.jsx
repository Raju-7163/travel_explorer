export default function MapPlacePreviewSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900/80"
      aria-hidden="true"
    >
      <div className="flex gap-3 p-3">
        <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
