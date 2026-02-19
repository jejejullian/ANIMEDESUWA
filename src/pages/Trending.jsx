import { useState, useEffect } from "react";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS } from "@utils/constants";
import AnimeCard from "@components/anime/AnimeCard";

export default function Trending() {
  const [lists, setLists] = useState({
    japan: [],
    china: [],
    korea: [],
    others: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${JIKAN_API_BASE}/top/anime?${JIKAN_ENDPOINTS.SEASON_NOW}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data dari Jikan API");
        return res.json();
      })
      .then((data) => {
        const categorized = {
          japan: [],
          china: [],
          korea: [],
          others: [],
        };

        data.data.forEach((anime) => {
          const title = anime.title || anime.title_english || "";
          const sourceLower = (anime.source || "").toLowerCase();
          const studios = anime.studios || [];

          // Deteksi China/Donghua
          const isDonghua = sourceLower.includes("manhua") || sourceLower.includes("donghua") || sourceLower.includes("chinese") || sourceLower.includes("web novel") || /[\u4e00-\u9fff]{3,}/.test(title); // minimal 3 karakter Hanzi

          const hasChineseStudio = studios.some((s) => {
            const nameLower = (s.name || "").toLowerCase();
            return nameLower.match(/bilibili|tencent|haoliners|sparkly|dongman|cmg|china|chinese|netEase|youku|iqi|acfun/i);
          });

          // Deteksi Korea
          const isKorean = sourceLower.includes("manhwa") || sourceLower.includes("korean") || /[\uac00-\ud7af]{3,}/.test(title); // minimal 3 Hangul

          const hasKoreanStudio = studios.some((s) => (s.name || "").toLowerCase().match(/korea|corea|dra|studio somewhere/i));

          if (isDonghua || hasChineseStudio) {
            categorized.china.push(anime);
          } else if (isKorean || hasKoreanStudio) {
            categorized.korea.push(anime);
          } else if (studios.length > 0 && studios.some((s) => (s.name || "").toLowerCase() !== "unknown") && !studios.some((s) => (s.name || "").toLowerCase().includes("china"))) {
            categorized.japan.push(anime);
          } else {
            categorized.others.push(anime);
          }
        });

        setLists(categorized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-foreground-muted">Sedang memuat anime trending...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  const hasJapan = lists.japan.length > 0;
  const hasChina = lists.china.length > 0;
  const hasKorea = lists.korea.length > 0;
  const hasOthers = lists.others.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Anime Trending Saat Ini</h1>

      {/* Section Jepang */}
      {hasJapan && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">Anime Jepang</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
            {lists.japan.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Section China / Donghua */}
      {hasChina && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">Donghua (China)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
            {lists.china.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Section Korea */}
      {hasKorea && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">Aeni / Adaptasi Korea</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
            {lists.korea.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Section Others*/}
      {hasOthers && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-brand mb-4">Lainnya</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
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
