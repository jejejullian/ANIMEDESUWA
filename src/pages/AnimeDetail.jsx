import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { useAnimeDetail } from "@hooks/useAnimeDetail";
import { useAnimeEpisodes } from "@hooks/useAnimeEpisodes";

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data: anime, 
    isLoading: detailLoading, 
    error: detailError 
  } = useAnimeDetail(id);

  const { 
    data: episodesData, 
    isLoading: episodesLoading, 
    error: episodesError 
  } = useAnimeEpisodes(id, currentPage);

  const episodes = episodesData?.episodes || [];
  const hasMoreEpisodes = episodesData?.hasNextPage ?? false;

  if (detailLoading) return <div className="p-6 text-center">Memuat detail anime...</div>;
  if (detailError) return <div className="p-6 text-red-500 text-center">Error: {detailError.message}</div>;
  if (!anime) return <div className="p-6 text-center">Anime tidak ditemukan</div>;

  return (
    <main className="min-h-screen bg-background p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-brand hover:text-brand-light flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-2xl"
      >
        <FaArrowLeft /> Kembali
      </button>

      <article className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row gap-8 mb-10">
          <img 
            src={anime.images.jpg.large_image_url || "https://via.placeholder.com/300x450?text=No+Image"} 
            alt={anime.title} 
            className="w-full md:w-80 rounded-xl shadow-2xl object-cover" 
          />

          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">{anime.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres?.map((g) => (
                <span key={g.mal_id} className="px-4 py-1 bg-brand/30 text-brand rounded-full text-sm">
                  {g.name}
                </span>
              ))}
            </div>

            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-8">
              <div>
                <dt className="text-foreground-muted">Score</dt>
                <dd><strong className="text-brand">⭐ {anime.score || "N/A"}</strong></dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Episodes</dt>
                <dd>{anime.episodes || "?"}</dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Status</dt>
                <dd>{anime.status}</dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Type</dt>
                <dd>{anime.type}</dd>
              </div>
              <div>
                <dt className="text-foreground-muted">Year</dt>
                <dd>{anime.year}</dd>
              </div>
            </dl>

            <section className="bg-surface-1 rounded-xl overflow-hidden mb-10">
              <header className="px-8 pt-8 pb-4 border-b border-outline/30 bg-surface-1">
                <h2 className="text-2xl font-bold text-foreground">Sinopsis</h2>
              </header>
              <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-surface-2 px-8 py-6">
                <p className="text-foreground-muted leading-relaxed whitespace-pre-line">
                  {anime.synopsis || "Tidak ada sinopsis tersedia."}
                </p>
              </div>
            </section>

            <button className="w-full md:w-auto bg-brand text-foreground px-8 py-4 rounded-xl font-bold hover:bg-brand-dark transition cursor-pointer">
              Tambah ke Watchlist
            </button>
          </div>
        </header>

        {anime.trailer?.youtube_id && (
          <section className="bg-surface-1 rounded-xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-4">Trailer</h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                title={`${anime.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}
      </article>

      {/* Daftar Episode */}
      <section className="bg-surface-1 rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-bold mb-6">Daftar Episode</h2>

        {episodesError && <p className="text-red-500 text-center mb-4">Gagal memuat episode: {episodesError.message}</p>}

        {episodes.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {episodes.map((ep) => (
                <li key={ep.mal_id} className="bg-surface-2 p-4 rounded-lg hover:bg-surface-3 transition cursor-pointer flex flex-col h-full">
                  <h3 className="font-semibold text-foreground">
                    Episode {ep.mal_id} — {ep.title || "Judul tidak tersedia"}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-xs">
                    {ep.aired && (
                      <p className="text-xs text-foreground-muted mt-2">
                        Tayang: {new Date(ep.aired).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    )}
                    {ep.filler && <span className="inline-block mt-2 text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Filler</span>}
                  </div>
                </li>
              ))}
            </ul>

            {hasMoreEpisodes && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => setCurrentPage(prev => prev + 1)} 
                  disabled={episodesLoading}
                  className="text-brand hover:text-brand-light flex items-center gap-2 cursor-pointer border px-6 py-2 rounded-2xl disabled:opacity-50"
                >
                  {episodesLoading ? "Memuat..." : "Muat Episode Selanjutnya"}
                </button>
              </div>
            )}
          </>
        ) : (
          !episodesLoading && <p className="text-foreground-muted text-center py-8">Tidak ada informasi episode tersedia untuk anime ini.</p>
        )}
      </section>
    </main>
  );
}