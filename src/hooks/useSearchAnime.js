import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE } from "@utils/constants";
import { enqueue } from "@utils/requestQueue";

export default function useSearchAnime(query) {
  return useQuery({
    queryKey: ["SearchAnime", query],
    queryFn: () =>
      enqueue(async () => {
        const res = await fetch(
          `${JIKAN_API_BASE}/anime?q=${query}&sfw=true`
        );
        if (!res.ok) {
          if (res.status === 429) throw new Error("Rate limit, tunggu sebentar...");
          throw new Error("Gagal mengambil data pencarian");
        }
        return res.json();
      }),
    enabled: !!query, 
    staleTime: 15 * 60 * 1000, 
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}