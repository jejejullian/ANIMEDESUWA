import { useSearchParams } from "react-router-dom";
import useTopMovie from "@hooks/useTopMovie";
import AnimeCard from "@components/anime/AnimeCard";
import Pagination from "@components/ui/Pagination";
import GridSkeleton from "@components/ui/GridSkeleton";

import PageHeader from "@components/ui/PageHeader";
import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

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

  if (error) return <StateMessage type="error" message={error.message} />;

  return (
    <div className={`p-4 sm:p-6 transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
      <PageHeader 
        emoji="🎬" 
        title="TOP MOVIE" 
        subtitle="Daftar film anime (Movie) dengan rating tertinggi" 
      />

      {isLoading && !isPlaceholderData ? (
        <GridSkeleton count={LIMIT} />
      ) : movies.length === 0 ? (
        <StateMessage message="Tidak ada movie ditemukan." />
      ) : (
        <>
          <AnimeGrid isFetching={isFetching}>
            {movies.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </AnimeGrid>

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