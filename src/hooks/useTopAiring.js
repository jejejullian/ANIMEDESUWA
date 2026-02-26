import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";

export default function useTopAiring(limit = 8) {
  return useQuery({
    queryKey: ["seasonNow", limit],        
    queryFn: async () => {
      const res = await fetch(
  `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.TOP_AIRING}&${JIKAN_QUERIES.LIMIT(limit)}&${JIKAN_QUERIES.SFW}`
);
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
        throw new Error("Gagal mengambil top airing");
      }

      const data = await res.json();
      return data.data || [];
    },
  });
}