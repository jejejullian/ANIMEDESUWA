import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS } from "@utils/constants";
import { enqueue } from "@utils/requestQueue";

export default function useGenres() {
  return useQuery({
    queryKey: ["anime-genres"],
    queryFn: () => enqueue(async () => {
      const res = await fetch(`${JIKAN_API_BASE}${JIKAN_ENDPOINTS.GENRES}`);
      
      if (!res.ok) {
        throw new Error("Gagal mengambil daftar genre");
      }
      
      const result = await res.json();
      
      const sortedGenres = (result.data || []).sort((a, b) => 
        a.name.localeCompare(b.name)
      );

      return sortedGenres;
    }),
    staleTime: 24 * 60 * 60 * 1000, 
    retry: 2,
  });
}