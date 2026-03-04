import { useTrending } from "@hooks/useTrending";
import AnimeCard from "@components/anime/AnimeCard";
import GridSkeleton from "@components/ui/GridSkeleton";

import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

export default function Trending() {
  const { data: lists = { japan: [], china: [], korea: [], others: [], totalCount: 0 }, isLoading, error } = useTrending();

  if (error) return <StateMessage type="error" message={error.message} />;

  const hasJapan = lists.japan.length > 0;
  const hasChina = lists.china.length > 0;
  const hasKorea = lists.korea.length > 0;
  const hasOthers = lists.others.length > 0;
  const hasAnyData = hasJapan || hasChina || hasKorea || hasOthers;

  return (
    <div className="p-4 sm:p-6">
      {isLoading ? (
        <GridSkeleton count={15} />
      ) : !hasAnyData ? (
        <StateMessage message="Tidak ada anime trending saat ini. Coba refresh kembali." />
      ) : (
        <>
          {hasJapan && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">Anime (Jepang) · {lists.japan.length}</h2>
              <AnimeGrid>
                {lists.japan.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </AnimeGrid>
            </section>
          )}

          {hasChina && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">Donghua (China) · {lists.china.length}</h2>
              <AnimeGrid>
                {lists.china.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </AnimeGrid>
            </section>
          )}

          {hasKorea && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">Aeni / Adaptasi Korea · {lists.korea.length}</h2>
              <AnimeGrid>
                {lists.korea.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </AnimeGrid>
            </section>
          )}

          {hasOthers && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">Lainnya · {lists.others.length}</h2>
              <AnimeGrid>
                {lists.others.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </AnimeGrid>
            </section>
          )}
        </>
      )}
    </div>
  );
}
