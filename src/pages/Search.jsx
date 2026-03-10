import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import AnimeGrid from "@components/anime/AnimeGrid";
import AnimeCard from "@components/anime/AnimeCard";
import GridSkeleton from "@components/ui/GridSkeleton";
import useSearchAnime from "@hooks/useSearchAnime"; 

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, error } = useSearchAnime(query);
  
  const results = data?.data || [];
  const errorMessage = error?.message;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      
      {errorMessage && <div className="text-center text-red-400 mt-10">Error: {errorMessage}</div>}

      {!isLoading && !query && (
        <div className="text-center text-foreground-muted py-10 mt-10">
          Silakan ketikkan judul anime di kolom pencarian Navbar untuk mulai mencari.
        </div>
      )}

      {query && !errorMessage && (
        <div className="mb-6 pt-2">
          {isLoading ? (
            <p className="text-foreground-muted md:text-lg">
              Mencari anime untuk <span className="text-white font-bold">"{query}"</span>...
            </p>
          ) : (
            <p className="text-foreground-muted md:text-lg">
              Menampilkan {results.length} hasil untuk <span className="text-white font-bold">"{query}"</span>
            </p>
          )}
        </div>
      )}

      {!isLoading && !errorMessage && results.length === 0 && query && (
        <div className="bg-surface-1 border border-outline rounded-2xl p-10 text-center flex flex-col items-center justify-center mt-6">
          <FaSearch className="text-6xl text-surface-3 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">"{query}" Tidak Ditemukan</h2>
          <p className="text-foreground-muted">Coba gunakan ejaan yang berbeda atau judul bahasa Jepangnya.</p>
        </div>
      )}

      {isLoading ? (
        <GridSkeleton count={12} />
      ) : (
        results.length > 0 && (
          <AnimeGrid>
            {results.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime}>
                {anime.type && (
                  <span className="absolute top-2 left-2 bg-brand/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-md backdrop-blur-sm">
                    {anime.type}
                  </span>
                )}
              </AnimeCard>
            ))}
          </AnimeGrid>
        )
      )}
    </div>
  );
}