import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";

export default function useScheduleAnime(day = "monday", limit = 24) {
  return useQuery({
    queryKey: ["ScheduleAnime", day, limit],
    queryFn: async () => {
      const res = await fetch(
        `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.SCHEDULES}?filter=${day}&limit=${limit}&${JIKAN_QUERIES.SFW}`
      );

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
        throw new Error("Gagal mengambil jadwal anime");
      }

      const result = await res.json();

      // Deduplicate
      let uniqueData = Array.from(
        new Map((result.data || []).map((a) => [a.mal_id, a])).values()
      );

      uniqueData.sort((a, b) => (b.score || 0) - (a.score || 0));

      const currentYear = new Date().getFullYear(); 

      uniqueData = uniqueData.filter((anime) => {
        const status = anime.status || "";
        const year = anime.year || 0;

        return (
          (status === "Currently Airing" || status === "Not yet aired") &&
          year >= currentYear  
        );
      });

      return {
        ...result,
        data: uniqueData,
      };
    },
    staleTime: 30 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}