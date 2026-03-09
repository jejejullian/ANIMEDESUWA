import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { supabase } from "@lib/supabase";
import { FaTrash, FaBookmark, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import PageHeader from "@components/ui/PageHeader";

export default function Watchlist() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState("Semua");
  const filterOptions = ["Semua", "TV", "Movie", "OVA", "ONA", "Special"];

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, navigate, isLoading]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      try {
        const { data: userAnimeData, error } = await supabase.from("user_anime").select("id, anime_id").eq("user_id", user.id).order("created_at", { ascending: false });

        if (error) throw error;

        if (!userAnimeData || userAnimeData.length === 0) {
          setWatchlist([]);
          setIsLoading(false);
          return;
        }

        const animeDetailsPromises = userAnimeData.map(async (item) => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const response = await fetch(`https://api.jikan.moe/v4/anime/${item.anime_id}`);
            if (!response.ok) throw new Error("Gagal fetch API");

            const result = await response.json();
            return {
              ...result.data,
              supabase_id: item.id,
            };
          } catch (err) {
            console.error("Gagal mengambil data anime:", err);
            return null;
          }
        });

        const animeDetails = await Promise.all(animeDetailsPromises);
        setWatchlist(animeDetails.filter((anime) => anime !== null));
      } catch (error) {
        toast.error("Gagal memuat daftar Watchlist.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleDelete = async (supabaseId, title) => {
    try {
      const { error } = await supabase.from("user_anime").delete().eq("id", supabaseId);

      if (error) throw error;

      setWatchlist(watchlist.filter((anime) => anime.supabase_id !== supabaseId));
      toast.success(`${title} dihapus dari Watchlist`);
    } catch (error) {
      toast.error("Gagal menghapus anime");
      console.error(error);
    }
  };

  const formatAiredDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  };

  const filteredWatchlist = activeFilter === "Semua" ? watchlist : watchlist.filter((anime) => anime.type === activeFilter);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Memuat Watchlist kamu...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-2 sm:p-3 bg-surface-1 hover:bg-surface-2 border border-outline rounded-xl text-foreground-muted hover:text-brand transition cursor-pointer"
          aria-label="Kembali"
        >
          <FaArrowLeft />
          <span className="text-sm">Kembali</span>
        </button>
      </div>
      <div className="text-center">
        <PageHeader title="My List"  />
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-surface-1 border border-outline rounded-2xl p-10 mt-4 text-center flex flex-col items-center justify-center">
          <FaBookmark className="text-6xl text-surface-3 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">My List Masih Kosong</h2>
          <p className="text-foreground-muted mb-6">Kamu belum menambahkan anime apapun ke dalam rencanamu.</p>
          <Link to="/" className="bg-brand text-foreground px-6 py-2.5 rounded-full font-medium hover:bg-brand-dark transition shadow-lg">
            Cari Anime Sekarang
          </Link>
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-none">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition cursor-pointer border ${
                  activeFilter === opt
                    ? "bg-brand text-background border-brand-dark" 
                    : "bg-surface-1 text-foreground-muted border-outline hover:text-foreground hover:bg-surface-2"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {filteredWatchlist.length === 0 ? (
              <p className="text-foreground-muted text-center py-8">Tidak ada anime dengan tipe {activeFilter} di My List kamu.</p>
            ) : (
              filteredWatchlist.map((anime) => (
                <div key={anime.mal_id} className="flex items-center gap-3 sm:gap-4 bg-surface-1 hover:bg-surface-2 border border-outline p-3 rounded-2xl transition group">
                  {/* Gambar Cover */}
                  <Link to={`/anime/${anime.mal_id}`} className="shrink-0 overflow-hidden rounded-xl">
                    <img src={anime.images.jpg.image_url} alt={anime.title} className="w-20 h-20 sm:w-24 sm:h-24 object-cover group-hover:scale-105 transition duration-300" />
                  </Link>

                  {/* Info Text */}
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <Link to={`/anime/${anime.mal_id}`}>
                      <h3 className="text-sm text-foreground font-bold line-clamp-1 hover:text-brand transition mb-1">{anime.title}</h3>
                    </Link>

                    <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-foreground-muted font-medium mb-1">
                      <span className="text-brand">⭐ {anime.score || "N/A"}</span>
                      <span className="text-outline">•</span>

                      <span className="bg-brand/20 text-brand px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider">{anime.type || "N/A"}</span>

                      <span className="text-outline">•</span>
                      <span>{formatAiredDate(anime.aired?.from) || anime.year || "N/A"}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-foreground-muted">Hingga episode {anime.episodes || "?"}</p>
                  </div>

                  {/* Tombol Hapus */}
                  <button onClick={() => handleDelete(anime.supabase_id, anime.title)} className="p-3 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition cursor-pointer ml-auto" aria-label="Hapus dari My List">
                    <FaTrash size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
