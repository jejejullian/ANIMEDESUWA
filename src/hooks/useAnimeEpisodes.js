import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export function useAnimeEpisodes(id, page = 1) {
  return useQuery({
    queryKey: ["animeEpisodes", id, page],
    queryFn: async ({ signal }) => {
      const data = await jikanFetch(JIKAN_ENDPOINTS.ANIME_EPISODES(id, page), { signal });
      return {
        episodes: data.data || [],
        hasNextPage: data.pagination?.has_next_page ?? false,
      };
    },
    enabled: !!id && !isNaN(id),
    staleTime: 15 * 60 * 1000,
  });
}
