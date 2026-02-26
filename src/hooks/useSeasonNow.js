import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";

export default function useSeasonNow(limit = 12) {
  return useQuery({
    queryKey: ["SeasonNow", limit],
    queryFn: async () => {
     const res = await fetch(
  `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.SEASONS_NOW}?${JIKAN_QUERIES.LIMIT(limit)}&${JIKAN_QUERIES.SFW}`
);

      if (!res.ok) {
        if (res.status == 429) throw new Error("Rate Limit, tunggu sebentar ...");
        throw new Error("Gagal mengambil data season now");
      }

      const data = await res.json();
      return data.data || [];
    },
  });
}
