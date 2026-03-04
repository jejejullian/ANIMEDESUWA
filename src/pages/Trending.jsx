import { useTrending } from "@hooks/useTrending";
import AnimeCard from "@components/anime/AnimeCard";
import GridSkeleton from "@components/ui/GridSkeleton";

export default function Trending() {
  const { 
    data: lists = { japan: [], china: [], korea: [], others: [], totalCount: 0 }, 
    isLoading, 
    error 
  } = useTrending();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground animate-pulse">
            Memuat Trending...
          </h1>
        </div>
        <GridSkeleton count={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const hasJapan = lists.japan.length > 0;
  const hasChina = lists.china.length > 0;
  const hasKorea = lists.korea.length > 0;
  const hasOthers = lists.others.length > 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Anime Trending Now</h1>
        {lists.totalCount > 0 && (
          <div className="text-sm text-foreground-muted">
            Total: {lists.totalCount} anime
          </div>
        )}
      </div>

      {/* Section Jepang */}
      {hasJapan && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">
            Anime (Jepang) · {lists.japan.length}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-fr">
            {lists.japan.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Section China / Donghua */}
      {hasChina && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">
            Donghua (China) · {lists.china.length}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-fr">
            {lists.china.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Section Korea */}
      {hasKorea && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">
            Aeni / Adaptasi Korea · {lists.korea.length}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-fr">
            {lists.korea.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Section Others */}
      {hasOthers && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">
            Lainnya · {lists.others.length}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-fr">
            {lists.others.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {!hasJapan && !hasChina && !hasKorea && !hasOthers && (
        <div className="text-center py-16">
          <p className="text-xl text-foreground-muted mb-2">Tidak ada anime trending saat ini</p>
          <p className="text-sm text-foreground-muted">Coba refresh halaman atau kembali lagi nanti</p>
        </div>
      )}
    </div>
  );
}