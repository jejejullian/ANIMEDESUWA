import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export default function useUpcomingAnime(page = 1, limit = 24) {
  return useQuery({
    queryKey: ["UpcomingAnime", page, limit],
    queryFn: async ({ signal }) => {
      const result = await jikanFetch(JIKAN_ENDPOINTS.SEASONS_UPCOMING, {
        signal,
        params: { page, limit, sfw: "true" },
      });
      const uniqueData = Array.from(new Map((result.data || []).map((a) => [a.mal_id, a])).values());
      return { ...result, data: uniqueData };
    },
    staleTime: 24 * 60 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
