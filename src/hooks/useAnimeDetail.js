import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS } from "@utils/constants";

export function useAnimeDetail(id) {
  return useQuery({
    queryKey: ["animeDetail", id],
    queryFn: async () => {
     const res = await fetch(`${JIKAN_API_BASE}${JIKAN_ENDPOINTS.ANIME_FULL(id)}`);

      if (!res.ok) {
        if (res.status === 404) throw new Error("Anime tidak ditemukan");
        if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
        throw new Error("Gagal mengambil detail anime");
      }

      const data = await res.json();
      return data.data;
    },
    enabled: !!id && !isNaN(id),   
    staleTime: 30 * 60 * 1000,     
    retry: 2,
  });
}