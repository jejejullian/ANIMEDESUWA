export default function SectionSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-28 sm:w-37 md:w-45 space-y-3 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="
            w-full h-40 sm:h-56 md:h-64
            rounded-xl
            bg-surface-3
            border border-outline
            overflow-hidden
          ">
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