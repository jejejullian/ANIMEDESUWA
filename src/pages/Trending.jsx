import { useTrending } from "@hooks/useTrending";
import AnimeCard from "@components/anime/AnimeCard";
import GridSkeleton from "@components/ui/GridSkeleton";

// Komponen Reusable
import PageHeader from "@components/ui/PageHeader";
import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

export default function Trending() {
  const { 
    data: lists = { japan: [], china: [], korea: [], others: [], totalCount: 0 }, 
    isLoading, 
    error 
  } = useTrending();

  if (error) return <StateMessage type="error" message={error.message} />;

  const hasJapan = lists.japan.length > 0;
  const hasChina = lists.china.length > 0;
  const hasKorea = lists.korea.length > 0;
  const hasOthers = lists.others.length > 0;
  const hasAnyData = hasJapan || hasChina || hasKorea || hasOthers;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <PageHeader 
          emoji="🔥" 
          title="ANIME TRENDING NOW" 
          subtitle="Sedang hangat diperbincangkan saat ini" 
        />
        {lists.totalCount > 0 && (
          <div className="text-sm font-medium text-brand bg-surface-2 px-4 py-2 rounded-full mb-6 md:mb-8 self-start md:self-auto border border-outline">
            Total Trending: {lists.totalCount}
          </div>
        )}
      </div>

      {isLoading ? (
        <GridSkeleton count={15} />
      ) : !hasAnyData ? (
        <StateMessage message="Tidak ada anime trending saat ini. Coba refresh kembali." />
      ) : (
        <>
          {hasJapan && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">
                Anime (Jepang) · {lists.japan.length}
              </h2>
              <AnimeGrid>
                {lists.japan.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </AnimeGrid>
            </section>
          )}

          {hasChina && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">
                Donghua (China) · {lists.china.length}
              </h2>
              <AnimeGrid>
                {lists.china.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </AnimeGrid>
            </section>
          )}

          {hasKorea && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">
                Aeni / Adaptasi Korea · {lists.korea.length}
              </h2>
              <AnimeGrid>
                {lists.korea.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </AnimeGrid>
            </section>
          )}

          {hasOthers && (
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-brand mb-4">
                Lainnya · {lists.others.length}
              </h2>
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