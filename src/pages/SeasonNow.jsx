import { useSearchParams } from "react-router-dom";
import useSeasonNow from "@hooks/useSeasonNow";
import AnimeCard from "@components/anime/AnimeCard";
import Pagination from "@components/ui/Pagination";
import GridSkeleton from "@components/ui/GridSkeleton";

// Komponen Reusable
import PageHeader from "@components/ui/PageHeader";
import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

export default function SeasonNow() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const LIMIT = 24;

  const { data, isLoading, error, isFetching, isPlaceholderData } = useSeasonNow(currentPage, LIMIT);

  const animes = (data?.data || [])
    .filter((anime) => anime.status !== "Not yet aired" && anime.aired?.from !== null)
    .filter((anime, index, self) => index === self.findIndex((a) => a.title === anime.title));

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

  if (error) return <StateMessage type="error" message={error.message} />;

  return (
    <div className={`p-4 sm:p-6 transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
      <PageHeader 
        emoji={emoji} 
        title={`SEASON NOW - ${season} ${year}`} 
        subtitle="Anime yang sedang tayang di season ini" 
      />

      {isLoading && !isPlaceholderData ? (
        <GridSkeleton count={LIMIT} />
      ) : animes.length === 0 ? (
        <StateMessage message={`Belum ada anime untuk musim ${season} ${year}.`} />
      ) : (
        <>
          <AnimeGrid isFetching={isFetching}>
            {animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime}>
                {anime.airing ? (
                  <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">● AIRING</span>
                ) : (
                  <span className="absolute top-2 left-2 z-10 bg-gray-600/80 text-white text-[10px] font-bold px-2 py-1 rounded">✓ FINISHED</span>
                )}
              </AnimeCard>
            ))}
          </AnimeGrid>

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