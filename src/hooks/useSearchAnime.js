import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export default function useSearchAnime(query) {
  return useQuery({
    queryKey: ["SearchAnime", query],
    // params di-encode otomatis, jadi "spy x family" / "&" / "#" tidak merusak URL
    queryFn: ({ signal }) =>
      jikanFetch(JIKAN_ENDPOINTS.ANIME_SEARCH, { signal, params: { q: query, sfw: "true" } }),
    enabled: !!query,
    staleTime: 15 * 60 * 1000,
  });
}
