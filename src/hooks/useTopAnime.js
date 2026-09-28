import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export default function useTopAnime(page = 1, limit = 24) {
  return useQuery({
    queryKey: ["TopAnime", page, limit],
    queryFn: ({ signal }) =>
      jikanFetch(JIKAN_ENDPOINTS.TOP_ANIME, {
        signal,
        params: { type: "tv", page, limit, sfw: "true" },
      }),
    staleTime: 24 * 60 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
