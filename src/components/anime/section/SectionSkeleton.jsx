export default function SectionSkeleton() {
  return (
    <section className="w-full px-4 md:px-8 mt-12">
      <div className="flex justify-between mb-4">
        <div className="h-5 w-40 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>

      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="min-w-40 md:min-w-45 h-60
            rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}