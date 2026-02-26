export default function SectionSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-28 sm:w-37 md:w-45 space-y-3"
        >
          {/* Image skeleton */}
          <div className="w-full h-40 sm:h-56 md:h-64 rounded-xl bg-gray-800 animate-pulse" />
          
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-800 rounded animate-pulse" />
            <div className="h-3 bg-gray-800 rounded w-3/4 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}