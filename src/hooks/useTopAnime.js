import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES} from "@utils/constants";

export default function useTopAnime(limit = 12) {
  return useQuery({
    queryKey: ["TopAnime", limit],
    queryFn: async () => {
      const res = await fetch(
      `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.TOP_ANIME}?type=tv&${JIKAN_QUERIES.LIMIT(limit)}&${JIKAN_QUERIES.SFW}`
      );

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
        throw new Error("Gagal mengambil data Top Anime");
      }

      const data = await res.json();
      return data.data || [];
    },
  });
}