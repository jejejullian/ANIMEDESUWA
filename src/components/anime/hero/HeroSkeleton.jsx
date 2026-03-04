export default function HeroSkeleton() {
  return (
    <div
      className="
        relative w-full overflow-hidden rounded-xl
        bg-surface-3 border border-outline
        animate-pulse
        aspect-16/6 min-h-80 max-h-130
      "
    >
      {/* Overlay gradient ala hero */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div className="w-full max-w-md space-y-3">
          {/* Title skeleton */}
          <div className="w-3/4 h-8 rounded bg-surface-2" />

          {/* Description skeleton */}
          <div className="w-full h-4 rounded bg-surface-2" />
          <div className="h-4 rounded w-5/6 bg-surface-2" />

          {/* Button skeleton */}
          <div className="flex gap-3 mt-4">
            <div className="w-32 h-10 rounded-full bg-surface-2" />
            <div className="w-32 h-10 rounded-full bg-surface-2" />
          </div>
        </div>
      </div>
    </div>
  );
}