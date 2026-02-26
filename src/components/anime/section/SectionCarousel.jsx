import { useRef, useState, useEffect } from "react";
import SectionControls from "./SectionControls";
import SectionSkeleton from "./SectionSkeleton";
import { useNavigate } from "react-router-dom";

export default function SectionCarousel({ title, animes = [], loading = false, showSeeAll = true }) {
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
        <div className="flex items-center mb-0 md:mb-6 ">
          <h2 className="text-sm md:text-3xl font-bold text-white tracking-widest">{title}</h2>
          <div className="flex-1 h-px bg-linear-to-r from-white/80 to-transparent ml-1 md:ml-6" />
          {showSeeAll && <button className="text-xs md:text-sm bg-brand text-foreground border px-1 md:px-2 py-0.5 md:py-1 rounded-2xl cursor-pointer border-none">See All</button>}
        </div>
      )}

      <div className="relative">
        {loading ? (
          <SectionSkeleton />
        ) : (
          <>
            <div ref={containerRef} className="flex gap-6 overflow-x-auto p-4 scroll-pl-4 snap-x snap-mandatory scroll-smooth section-carousel-scroll">
              {animes.map((anime) => (
                <div onClick={() => navigate(`/anime/${anime.mal_id}`)} key={anime.mal_id} anime={anime} className="shrink-0 w-28 sm:w-37 md:w-45 snap-start cursor-pointer group">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl">
                    <img src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url} alt={anime.title} className="w-full h-40 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                    {anime.year && <div className="absolute top-0 left-0 bg-brand text-foreground text-[10px] font-bold px-2 py-0.5 rounded tracking-widest">{anime.year}</div>}
                     {anime.score && <span className="absolute bottom-0 right-0 bg-brand text-foreground text-[10px] font-bold px-1 py-0.5 rounded tracking-widest">★ {anime.score}</span>}
                  </div>
                  <p className="text-foreground text-[10px] md:text-sm font-medium mt-3 text-center line-clamp-2 leading-tight">{anime.title.toUpperCase()}</p>
                  {anime.latestEpisode && <p className="text-emerald-400 text-xs md:text-sm font-medium mt-1 text-center">{anime.latestEpisode.title}</p>}
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
