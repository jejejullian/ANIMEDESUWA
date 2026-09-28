import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

export default function useGenres() {
  return useQuery({
    queryKey: ["anime-genres"],
    queryFn: async ({ signal }) => {
      const result = await jikanFetch(JIKAN_ENDPOINTS.GENRES, { signal });
      return [...(result.data || [])].sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}
