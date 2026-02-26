import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS } from "@utils/constants";

export function useAnimeEpisodes(id, page = 1) {
  return useQuery({
    queryKey: ["animeEpisodes", id, page],
    queryFn: async () => {
      const res = await fetch(`${JIKAN_API_BASE}${JIKAN_ENDPOINTS.ANIME_EPISODES(id, page)}`);

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
        throw new Error("Gagal memuat episode");
      }

      const data = await res.json();
      return {
        episodes: data.data || [],
        hasNextPage: data.pagination?.has_next_page ?? false,
      };
    },
    enabled: !!id && !isNaN(id),
    staleTime: 15 * 60 * 1000, 
    retry: 2,
  });
}