export default function GridSkeleton({ count = 24 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          {/* Image skeleton */}
          <div className="w-full aspect-2/3 rounded-xl bg-surface-3 overflow-hidden border border-outline">
            <div className="w-full h-full bg-linear-to-t from-black/30 to-transparent" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-2 px-1">
            <div className="h-3 bg-surface-2 rounded" />
            <div className="h-3 bg-surface-2 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}