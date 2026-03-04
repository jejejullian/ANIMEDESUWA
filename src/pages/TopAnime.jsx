import { useSearchParams } from "react-router-dom";
import useTopAnime from "@hooks/useTopAnime";
import AnimeCard from "@components/anime/AnimeCard";
import Pagination from "@components/ui/Pagination";
import GridSkeleton from "@components/ui/GridSkeleton";

// Komponen Reusable
import PageHeader from "@components/ui/PageHeader";
import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

export default function TopAnime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const LIMIT = 24;

  const { data, isLoading, error, isFetching, isPlaceholderData } = useTopAnime(currentPage, LIMIT);

  const animes = data?.data || [];
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
        emoji="🏆" 
        title="TOP ANIME" 
        subtitle="Anime terbaik berdasarkan rating" 
      />

      {isLoading && !isPlaceholderData ? (
        <GridSkeleton count={LIMIT} />
      ) : animes.length === 0 ? (
        <StateMessage message="Belum ada daftar top anime saat ini." />
      ) : (
        <>
          <AnimeGrid isFetching={isFetching}>
            {animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </AnimeGrid>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-6 mt-12">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} isLoading={isFetching} />
              <p className="text-sm text-gray-400">
                Page {currentPage} of {totalPages} • Total {paginationInfo.items?.total || 0} Anime
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}