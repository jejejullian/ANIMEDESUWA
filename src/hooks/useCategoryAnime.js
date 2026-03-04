import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE } from "@utils/constants";
import { enqueue } from "@utils/requestQueue";

export default function useCategoryAnime({
  genre,
  status,
  type,
  orderBy,
  page,
}) {
  return useQuery({
    queryKey: [
      "category-anime",
      genre,
      status,
      type,
      orderBy,
      page,
    ],

    queryFn: () => enqueue(async () => {
      const params = new URLSearchParams({
        page,
        limit: 24,
        sfw: "true",
      });

      if (genre)  params.append("genres", genre);
      if (status) params.append("status", status);
      if (type)   params.append("type", type);

      // ORDER BY
      switch (orderBy) {
        case "az":
          params.append("order_by", "title");
          params.append("sort", "asc");
          break;
        case "za":
          params.append("order_by", "title");
          params.append("sort", "desc");
          break;
        case "popular":
          params.append("order_by", "members");
          params.append("sort", "desc");
          break;
        case "updated":
          params.append("order_by", "start_date");
          params.append("sort", "desc");
          break;
        case "rating":
        default:
          params.append("order_by", "score");
          params.append("sort", "desc");
          

          if (!status) {
              params.append("min_score", "1"); 
          }
          break;
      }

      const res = await fetch(`${JIKAN_API_BASE}/anime?${params}`);

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit, tunggu beberapa saat...");
        }
        throw new Error("Gagal mengambil data anime");
      }

      const result = await res.json();
      
      if (result.data) {
        let animes = result.data;

        if (orderBy === "rating") {
            animes = animes.filter(anime => anime.score !== null && anime.status !== "Not yet aired");
        }

        const uniqueAnimes = Array.from(new Map(animes.map(a => [a.mal_id, a])).values());
        
        result.data = uniqueAnimes;
      }

      return result;
    }),

    staleTime: 15 * 60 * 1000,
    retry: 2,
  });
}