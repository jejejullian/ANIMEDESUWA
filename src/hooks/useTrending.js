import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function useTrending() {   
  return useQuery({
    queryKey: ["trending-all-2026"],        
    queryFn: async () => {
      const currentYear = new Date().getFullYear(); 
      const allAnimes = [];
      const pageSize = 25; 
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        try {
          const res = await fetch(
            `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.TOP_AIRING}&${JIKAN_QUERIES.LIMIT(pageSize)}&page=${page}&${JIKAN_QUERIES.SFW}`
          );

          if (!res.ok) {
            if (res.status === 429) {
              await delay(2000);
              continue; 
            }
            throw new Error("Gagal mengambil data trending");
          }

          const data = await res.json();
          const items = data.data || [];
          
         
          const currentYearAnimes = items.filter((anime) => {
           
            const animeYear = anime.year || 
                             (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null);
            return animeYear === currentYear;
          });

         
          allAnimes.push(...currentYearAnimes);

        
          hasNextPage = data.pagination?.has_next_page || false;
          
         
          if (currentYearAnimes.length === 0 && page > 1) {
            hasNextPage = false;
          }
          
          if (hasNextPage) {
            page++;
            await delay(500);
          }
        } catch (error) {
          console.error(`Error fetching page ${page}:`, error);
          if (!error.message.includes("429")) {
            hasNextPage = false;
          }
        }
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

        const isDonghua = 
          sourceLower.includes("manhua") || 
          sourceLower.includes("donghua") || 
          sourceLower.includes("chinese") || 
          sourceLower.includes("web novel") ||
          /[\u4e00-\u9fff]{3,}/.test(title);

        const hasChineseStudio = studios.some((s) => {
          const nameLower = (s.name || "").toLowerCase();
          return nameLower.match(/bilibili|tencent|haoliners|sparkly|dongman|cmg|china|chinese|netease|youku|iqi|acfun/i);
        });

        const isKorean = 
          sourceLower.includes("manhwa") || 
          sourceLower.includes("korean") || 
          /[\uac00-\ud7af]{3,}/.test(title);

        const hasKoreanStudio = studios.some((s) => 
          (s.name || "").toLowerCase().match(/korea|corea|dra|studio somewhere/i)
        );

        if (isDonghua || hasChineseStudio) {
          categorized.china.push(anime);
        } else if (isKorean || hasKoreanStudio) {
          categorized.korea.push(anime);
        } else if (
          studios.length > 0 && 
          studios.some((s) => (s.name || "").toLowerCase() !== "unknown") &&
          !studios.some((s) => (s.name || "").toLowerCase().includes("china"))
        ) {
          categorized.japan.push(anime);
        } else {
          categorized.others.push(anime);
        }
      });

      return {
        ...categorized,
        totalCount: allAnimes.length,
        year: currentYear
      };
    },
    
    staleTime: 60 * 60 * 1000, 
    gcTime: 2 * 60 * 60 * 1000, 
  });
}