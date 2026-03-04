import { useState } from "react";
import useCategoryAnime from "@hooks/useCategoryAnime";
import useGenres from "@hooks/useGenres";
import AnimeCard from "@components/anime/AnimeCard";
import CategoryFilterBar from "@components/anime/CategoryFilterBar";
import Pagination from "@components/ui/Pagination";
import GridSkeleton from "@components/ui/GridSkeleton";

import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

export default function CategoryAnime() {
  const [filters, setFilters] = useState({
    genre: "",
    status: "",
    type: "",
    orderBy: "rating",
    page: 1,
  });

  const { data, isLoading, isFetching, error } = useCategoryAnime(filters);
  const { data: genresData } = useGenres();

  const animes = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.last_visible_page || 1;

  const update = (key) => (value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const hasActiveFilters = filters.genre !== "" || filters.status !== "" || filters.type !== "" || filters.orderBy !== "rating" || filters.page !== 1;

  if (error) return <StateMessage type="error" message={error.message} />;

  return (
    <div className="p-4 sm:p-6 space-y-6 md:space-y-8">
      <CategoryFilterBar filters={filters} update={update} setFilters={setFilters} genresData={genresData} hasActiveFilters={hasActiveFilters} />

      {isLoading ? (
        <GridSkeleton count={24} />
      ) : animes.length === 0 ? (
        <StateMessage message="Tidak ada anime yang cocok dengan filter kamu." />
      ) : (
        <>
          <AnimeGrid isFetching={isFetching}>
            {animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </AnimeGrid>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} isLoading={isFetching} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
