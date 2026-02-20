import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS } from "@utils/constants";
import { FaArrowLeft } from "react-icons/fa";

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [episodesError, setEpisodesError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch detail anime
  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("ID anime tidak valid");
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await fetch(`${JIKAN_API_BASE}/anime/${id}/full`);
        if (!res.ok) throw new Error(`Anime tidak ditemukan (status ${res.status})`);
        const data = await res.json();
        setAnime(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // Fetch episodes
  useEffect(() => {
    if (!anime || !hasMoreEpisodes) return;

    const fetchEpisodes = async () => {
      setEpisodesLoading(true);
      try {
        const res = await fetch(`${JIKAN_API_BASE}${JIKAN_ENDPOINTS.ANIME_EPISODES(id, currentPage)}`);
        if (!res.ok) throw new Error(`Gagal memuat episode (status ${res.status})`);
        const data = await res.json();

        setEpisodes((prev) => {
          const existingIds = new Set(prev.map((ep) => ep.mal_id));
          const newEp = data.data.filter((ep) => !existingIds.has(ep.mal_id));
          return [...prev, ...newEp];
        });

        setHasMoreEpisodes(data.pagination?.has_next_page ?? false);
      } catch (err) {
        setEpisodesError(err.message);
      } finally {
        setEpisodesLoading(false);
      }
    };

    fetchEpisodes();
  }, [anime, currentPage, id, hasMoreEpisodes]); 

  if (loading) return <div className="p-6 text-center">Memuat detail anime...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  if (!anime) return <div className="p-6 text-center">Anime tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <button onClick={() => navigate(-1)} className="mb-6 text-brand hover:text-brand-light flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-2xl">
        <FaArrowLeft /> Kembali
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <img src={anime.images.jpg.large_image_url || "https://via.placeholder.com/300x450?text=No+Image"} alt={anime.title} className="w-full md:w-80 rounded-xl shadow-2xl object-cover" />

          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">{anime.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres?.map((g) => (
                <span key={g.mal_id} className="px-4 py-1 bg-brand/30 text-brand rounded-full text-sm">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-8">
              <div>
                <span className="text-foreground-muted">Score:</span> <strong className="text-brand">⭐ {anime.score || "N/A"}</strong>
              </div>
              <div>
                <span className="text-foreground-muted">Episodes:</span> {anime.episodes || "?"}
              </div>
              <div>
                <span className="text-foreground-muted">Status:</span> {anime.status}
              </div>
              <div>
                <span className="text-foreground-muted">Type:</span> {anime.type}
              </div>
              <div>
                <span className="text-foreground-muted">Year:</span> {anime.year}
              </div>
            </div>

            <div className="bg-surface-1 rounded-xl overflow-hidden mb-10">
              <div className="px-8 pt-8 pb-4 border-b border-outline/30 bg-surface-1">
                <h2 className="text-2xl font-bold text-foreground">Sinopsis</h2>
              </div>

              <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-brand scrollbar-track-surface-2 px-8 py-6">
                <p className="text-foreground-muted leading-relaxed whitespace-pre-line">{anime.synopsis || "Tidak ada sinopsis tersedia."}</p>
              </div>
            </div>

            <button className="w-full md:w-auto bg-brand text-foreground px-8 py-4 rounded-xl font-bold hover:bg-brand-dark transition cursor-pointer">+ Tambah ke Watchlist</button>
          </div>
        </div>

        {anime.trailer?.youtube_id && (
          <div className="bg-surface-1 rounded-xl p-8">
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
          </div>
        )}
      </div>

      {/* Daftar Episode */}
      <div className="bg-surface-1 rounded-xl p-8 mt-10">
        <h2 className="text-2xl font-bold mb-6">Daftar Episode</h2>

        {episodesLoading && episodes.length === 0 && <p className="text-foreground-muted text-center">Memuat daftar episode...</p>}

        {episodesError && <p className="text-red-500 text-center">Gagal memuat episode: {episodesError}</p>}

        {episodes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {episodes.map((ep) => (
                <div key={ep.mal_id} className="bg-surface-2 p-4 rounded-lg hover:bg-surface-3 transition cursor-pointer flex flex-col h-full">
                  <h3 className="font-semibold text-foreground">
                    Episode {ep.mal_id} — {ep.title || "Judul tidak tersedia"}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-xs">
                    {ep.aired && (
                      <p className="text-xs text-foreground-muted mt-2">
                        Tayang:{" "}
                        {new Date(ep.aired).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {ep.filler && <span className="inline-block mt-2 text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Filler</span>}
                  </div>
                </div>
              ))}
            </div>
            {hasMoreEpisodes && (
              <div className="mt-6 flex justify-center">
                <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={episodesLoading} className="text-brand hover:text-brand-light flex items-center gap-2 cursor-pointer border px-6 py-2 rounded-2xl">
                  {episodesLoading ? "Memuat..." : "Muat Episode Selanjutnya"}
                </button>
              </div>
            )}
          </>
        ) : (
          !episodesLoading && !episodesError && <p className="text-foreground-muted text-center py-8">Tidak ada informasi episode tersedia untuk anime ini (mungkin movie atau belum rilis).</p>
        )}
      </div>
    </div>
  );
}
