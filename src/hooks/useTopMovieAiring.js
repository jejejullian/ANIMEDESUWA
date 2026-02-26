import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";

export default function useTopMovie(limit = 12) {   
  return useQuery({
    queryKey: ["TopMovie", limit],
    queryFn: async () => {
   const res = await fetch(
        `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.TOP_ANIME}?type=movie&${JIKAN_QUERIES.LIMIT(limit)}&${JIKAN_QUERIES.SFW}`
      );

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
        throw new Error("Gagal mengambil Top Movie");
      }

      const data = await res.json();
      return data.data || [];
    },

    staleTime: 24 * 60 * 60 * 1000,
    retry: 2,
  });
}