import { useSearchParams } from "react-router-dom";
import useSeasonNow from "@hooks/useSeasonNow";
import GridSkeleton from "@components/ui/GridSkeleton";
import Pagination from "@components/ui/Pagination";
import AnimeCard from "@components/anime/AnimeCard";

export default function SeasonNow() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const LIMIT = 24;

  const { data, isLoading, error, isFetching, isPlaceholderData } = useSeasonNow(currentPage, LIMIT);

  const animes = (data?.data || []).filter((anime) => anime.status !== "Not yet aired" && anime.aired?.from !== null).filter((anime, index, self) => index === self.findIndex((a) => a.title === anime.title));

  const paginationInfo = data?.pagination || {};
  const totalPages = paginationInfo.last_visible_page || 1;

  const getCurrentSeasonInfo = () => {    
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    if (month >= 0 && month <= 2) return { season: "Winter", emoji: "❄️", year };
    if (month >= 3 && month <= 5) return { season: "Spring", emoji: "🌸", year };
    if (month >= 6 && month <= 8) return { season: "Summer", emoji: "☀️", year };
    return { season: "Fall", emoji: "🍂", year };
  };

  const { season, year, emoji } = getCurrentSeasonInfo();

  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-xl text-red-500">Error: {error.message}</div>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors">
          Coba Lagi
        </button>
      </div>
    );

  return (
    <div className={`p-4 sm:p-6 transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-widest">
          {emoji} SEASON NOW - {season.toUpperCase()} {year}
        </h1>
        <p className="text-sm md:text-base text-foreground-muted">Anime yang sedang tayang di season ini</p>
      </div>

      {isLoading && !isPlaceholderData ? (
        <GridSkeleton count={LIMIT} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
            {animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime}>
                {anime.airing ? (
                  <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">● AIRING</span>
                ) : (
                  <span className="absolute top-2 left-2 z-10 bg-gray-600/80 text-white text-[10px] font-bold px-2 py-1 rounded">✓ FINISHED</span>
                )}
              </AnimeCard>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-6 mt-12">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} isLoading={isFetching} />
              <p className="text-sm text-gray-400">
                Page {currentPage} of {totalPages} • {animes.length} anime in {season} ({paginationInfo.items?.total || 0} total)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
