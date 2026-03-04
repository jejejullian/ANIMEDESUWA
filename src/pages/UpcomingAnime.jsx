import { useSearchParams } from "react-router-dom";
import useUpcomingAnime from "@hooks/useUpcomingAnime";
import GridSkeleton from "@components/ui/GridSkeleton";
import AnimeCard from "@components/anime/AnimeCard";
import Pagination from "@components/ui/Pagination";

export default function UpcomingAnime() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const LIMIT = 24;

  const { data, isLoading, error, isFetching, isPlaceholderData } = useUpcomingAnime(currentPage, LIMIT);

  const animes = data?.data || [];
  const paginationInfo = data?.pagination || {};
  const totalPages = paginationInfo.last_visible_page || 1;
  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-red-500">Error: {error.message}</div>
      </div>
    );

  return (
    <div className={`p-4 sm:p-6 transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 tracking-widest">Upcoming</h1>
      </div>

      {isLoading && !isPlaceholderData ? (
        <GridSkeleton count={LIMIT} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
            {animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime}>
                <span className="absolute top-2 left-2 z-10 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded">🕒 UPCOMING</span>

                <span className="absolute bottom-2 left-2 bg-surface-2/80 text-foreground text-[10px] px-2 py-0.5 rounded-sm">
                  {anime.year ? anime.year : anime.season && anime.year ? `${anime.season.toUpperCase()} ${anime.year}` : "TBA"}
                </span>
              </AnimeCard>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-6 mt-12">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} isLoading={isFetching} />

              <p className="text-sm text-gray-400">
                page {currentPage} of {totalPages} • Total {paginationInfo.items?.total || 0} Anime
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
