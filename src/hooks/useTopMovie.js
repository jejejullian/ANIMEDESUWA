import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";
import { enqueue } from "@utils/requestQueue";

export default function useTopMovie(page = 1, limit = 24) {
  return useQuery({
    queryKey: ["TopMovie", page, limit],
    queryFn: () =>
      enqueue(async () => {
        const res = await fetch(
          `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.TOP_ANIME}?type=movie&page=${page}&limit=${limit}&${JIKAN_QUERIES.SFW}`
        );
        if (!res.ok) {
          if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
          throw new Error("Gagal mengambil Top Movie");
        }
        return res.json();
      }),
    staleTime: 24 * 60 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    placeholderData: (previousData) => previousData,
  });
}