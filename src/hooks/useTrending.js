import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

const MAX_PAGES = 8; // pengaman: sebelumnya bisa looping tanpa batas saat kena 429

export function useTrending() {
  return useQuery({
    queryKey: ["trending-all-2026"],
    queryFn: async ({ signal }) => {
      const currentYear = new Date().getFullYear();
      const allAnimes = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage && page <= MAX_PAGES) {
        let data;
        try {
          data = await jikanFetch(JIKAN_ENDPOINTS.TOP_AIRING, {
            signal,
            params: { limit: 25, page, sfw: "true" },
          });
        } catch (error) {
          if (page === 1 || error?.name === "AbortError") throw error;
          break; // halaman berikutnya gagal: pakai data yang sudah terkumpul
        }

        const items = data.data || [];
        const currentYearAnimes = items.filter((anime) => {
          const animeYear = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null);
          return animeYear === currentYear;
        });
        allAnimes.push(...currentYearAnimes);

        hasNextPage = data.pagination?.has_next_page || false;
        if (currentYearAnimes.length === 0 && page > 1) hasNextPage = false;
        page++;
      }

      const categorized = {
        japan: [],
        china: [],
        korea: [],
        others: [],
      };

      allAnimes.forEach((anime) => {
        const title = anime.title || anime.title_english || "";
        const sourceLower = (anime.source || "").toLowerCase();
        const studios = anime.studios || [];

        const isDonghua = sourceLower.includes("manhua") || sourceLower.includes("donghua") || sourceLower.includes("chinese") || sourceLower.includes("web novel") || /[\u4e00-\u9fff]{3,}/.test(title);

        const hasChineseStudio = studios.some((s) => {
          const nameLower = (s.name || "").toLowerCase();
          return nameLower.match(/bilibili|tencent|haoliners|sparkly|dongman|cmg|china|chinese|netease|youku|iqi|acfun/i);
        });

        const isKorean = sourceLower.includes("manhwa") || sourceLower.includes("korean") || /[\uac00-\ud7af]{3,}/.test(title);

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

      return {
        ...categorized,
        totalCount: allAnimes.length,
        year: currentYear,
      };
    },

    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
}
