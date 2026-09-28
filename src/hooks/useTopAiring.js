import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export default function useTopAiring(limit = 8) {
  return useQuery({
    queryKey: ["TopAiring", limit],
    queryFn: async ({ signal }) => {
      const res = await jikanFetch(JIKAN_ENDPOINTS.TOP_AIRING, {
        signal,
        params: { limit, sfw: "true" },
      });
      return res.data || [];
    },
    staleTime: 30 * 60 * 1000,
  });
}
