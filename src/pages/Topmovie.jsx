import { useSearchParams } from "react-router-dom";
import useTopMovie from "@hooks/useTopMovie";
import GridSkeleton from "@components/ui/GridSkeleton";
import Pagination from "@components/ui/Pagination";
import AnimeCard from "@components/anime/AnimeCard";

export default function TopMovie() {
  const [searchParams, setSearchParams] = useSearchParams();

  const LIMIT = 24;

  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error, isFetching, isPlaceholderData } = useTopMovie(currentPage, LIMIT);

  const movies = data?.data || [];
  const paginationInfo = data?.pagination || {};
  const totalPages = paginationInfo.last_visible_page || 1;

  const handlePageChange = (page) => {
    setSearchParams({ page }); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return <div className="flex items-center justify-center min-h-[60vh] text-red-500">{error.message}</div>;
  }

  return (
    <div className={`p-4 sm:p-6 transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
      <h1 className="text-2xl md:text-4xl font-bold mb-2">🎬 TOP MOVIE</h1>

      {isLoading && !isPlaceholderData ? (
        <GridSkeleton count={LIMIT} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
            {movies.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} isLoading={isFetching} />
              <p className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
