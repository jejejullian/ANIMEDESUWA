import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; 
import useCategoryAnime from "@hooks/useCategoryAnime";
import useGenres from "@hooks/useGenres";
import AnimeCard from "@components/anime/AnimeCard";
import CategoryFilterBar from "@components/anime/CategoryFilterBar";
import Pagination from "@components/ui/Pagination";
import GridSkeleton from "@components/ui/GridSkeleton";

import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

export default function CategoryAnime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "",
    status: searchParams.get("status") || "",
    type: searchParams.get("type") || "",
    orderBy: searchParams.get("orderBy") || "rating",
    page: parseInt(searchParams.get("page")) || 1, 
  });

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.genre) params.set("genre", filters.genre);
    if (filters.status) params.set("status", filters.status);
    if (filters.type) params.set("type", filters.type);
    if (filters.orderBy !== "rating") params.set("orderBy", filters.orderBy);
    if (filters.page > 1) params.set("page", filters.page); 

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

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