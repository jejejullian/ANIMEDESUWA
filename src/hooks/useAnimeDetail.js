import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export function useAnimeDetail(id) {
  return useQuery({
    queryKey: ["animeDetail", id],
    queryFn: async ({ signal }) => {
      const res = await jikanFetch(JIKAN_ENDPOINTS.ANIME_FULL(id), { signal });
      return res.data;
    },
    enabled: !!id && !isNaN(id),
    staleTime: 30 * 60 * 1000,
  });
}
