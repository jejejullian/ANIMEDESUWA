import { useRef, useState, useEffect } from "react";
import SectionControls from "./SectionControls";
import SectionSkeleton from "./SectionSkeleton";
import { useNavigate } from "react-router-dom";
import AnimeCard from "../AnimeCard";

export default function SectionCarousel({ title, animes = [], loading = false, showSeeAll = true, seeAllLink }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateControls = () => {
    const el = containerRef.current;
    if (!el) return;

    setCanPrev(el.scrollLeft > 5);
    setCanNext(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth);
  };

  const handlePrev = () => {
    containerRef.current?.scrollBy({ left: -240, behavior: "smooth" });
  };

  const handleNext = () => {
    containerRef.current?.scrollBy({ left: 240, behavior: "smooth" });
  };

  const handleSeeAll = () => {
    if (seeAllLink) {
      navigate(seeAllLink);
    }
  };

  useEffect(() => {
    if (loading) return;

    updateControls();

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateControls);
    window.addEventListener("resize", updateControls);

    return () => {
      el.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [loading, animes]);

  return (
    <section className="w-full mt-12">
      {title && (
        <div className="flex items-center mb-0 md:mb-6">
          <h2 className="text-sm md:text-3xl font-bold text-white tracking-widest">{title}</h2>
          <div className="flex-1 h-px bg-linear-to-r from-white/80 to-transparent ml-1 md:ml-6" />
          {showSeeAll && (
            <button onClick={seeAllLink ? handleSeeAll : undefined} className="text-xs md:text-sm bg-brand text-foreground border px-1 md:px-2 py-0.5 md:py-1 rounded-2xl cursor-pointer border-none hover:opacity-90 transition-opacity">
              See All
            </button>
          )}
        </div>
      )}

      <div className="relative">
        {loading ? (
          <SectionSkeleton />
        ) : (
          <>
            <div ref={containerRef} className="flex gap-6 overflow-x-auto p-4 scroll-pl-4 snap-x snap-mandatory scroll-smooth section-carousel-scroll">
              {animes.map((anime) => (
                <div key={anime.mal_id} className="shrink-0 w-28 sm:w-37 md:w-45 snap-start">
                  <AnimeCard anime={anime}>
                    {/* Badge Airing */}
                    {anime.airing && <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">● AIRING</span>}

                    {/* Badge Upcoming */}
                    {anime.status === "Not yet aired" && <span className="absolute top-2 left-2 z-10 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded">🕒 UPCOMING</span>}
                  </AnimeCard>
                </div>
              ))}
            </div>

            <SectionControls onPrev={handlePrev} onNext={handleNext} canPrev={canPrev} canNext={canNext} />
          </>
        )}
      </div>
    </section>
  );
}
