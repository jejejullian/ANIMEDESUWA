import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";
import { enqueue } from "@utils/requestQueue";

export default function useUpcomingAnime(page = 1, limit = 24) {
  return useQuery({
    queryKey: ["UpcomingAnime", page, limit],
    queryFn: () =>
      enqueue(async () => {
        const res = await fetch(
          `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.SEASONS_UPCOMING}?page=${page}&limit=${limit}&${JIKAN_QUERIES.SFW}`
        );
        if (!res.ok) {
          if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
          throw new Error("Gagal mengambil data Upcoming Anime");
        }
        const result = await res.json();
        const uniqueData = Array.from(
          new Map((result.data || []).map((anime) => [anime.mal_id, anime])).values()
        );
        return { ...result, data: uniqueData };
      }),
    staleTime: 24 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    placeholderData: (previousData) => previousData,
  });
}