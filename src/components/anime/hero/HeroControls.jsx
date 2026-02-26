export default function HeroControls({
  current,
  total,
  onPrev,
  onNext,
  onDotClick,
}) {
  return (
    <>
      {/* Panah prev */}
      <button
        onClick={onPrev}
        aria-label="Sebelumnya"
        className="absolute left-3 top-1/2 z-3 flex items-center justify-center w-9 h-9 -translate-y-1/2 transition-all duration-200 rounded-full cursor-pointer bg-black/40 hover:bg-black/70 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/10 text-white"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Panah next */}
      <button
        onClick={onNext}
        aria-label="Berikutnya"
        className="absolute right-3 top-1/2 z-3 flex items-center justify-center w-9 h-9 -translate-y-1/2 transition-all duration-200 rounded-full cursor-pointer bg-black/40 hover:bg-black/70 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/10 text-white"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 z-3 flex gap-1.5 -translate-x-1/2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? "w-6 h-2 bg-orange-500" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </>
  );
}