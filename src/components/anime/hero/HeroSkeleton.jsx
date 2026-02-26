export default function HeroSkeleton() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-gray-800 animate-pulse aspect-16/6 min-h-80 max-h-130"
    >
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div className="w-full max-w-md space-y-3">
          <div className="w-3/4 h-8 rounded bg-gray-700" />
          <div className="w-full h-4 rounded bg-gray-700" />
          <div className="h-4 rounded w-5/6 bg-gray-700" />
          <div className="flex gap-3 mt-4">
            <div className="w-32 h-10 rounded-full bg-gray-700" />
            <div className="w-32 h-10 rounded-full bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}