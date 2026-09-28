import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export default function useScheduleAnime(day = "monday", limit = 24) {
  return useQuery({
    queryKey: ["ScheduleAnime", day, limit],
    queryFn: async ({ signal }) => {
      const result = await jikanFetch(JIKAN_ENDPOINTS.SCHEDULES, {
        signal,
        params: { filter: day, limit, sfw: "true" },
      });

      // Deduplicate
      let uniqueData = Array.from(new Map((result.data || []).map((a) => [a.mal_id, a])).values());
      uniqueData.sort((a, b) => (b.score || 0) - (a.score || 0));

      const currentYear = new Date().getFullYear();
      uniqueData = uniqueData.filter((anime) => {
        const status = anime.status || "";
        const year = anime.year || 0;
        return (status === "Currently Airing" || status === "Not yet aired") && year >= currentYear;
      });

      return { ...result, data: uniqueData };
    },
    staleTime: 30 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
