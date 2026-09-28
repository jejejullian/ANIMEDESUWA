import { useQuery } from "@tanstack/react-query";
import { jikanFetch } from "@utils/jikanClient";

const ORDER = {
  az: { order_by: "title", sort: "asc" },
  za: { order_by: "title", sort: "desc" },
  popular: { order_by: "members", sort: "desc" },
  updated: { order_by: "start_date", sort: "desc" },
  rating: { order_by: "score", sort: "desc" },
};

export default function useCategoryAnime({ genre, status, type, orderBy, page }) {
  return useQuery({
    queryKey: ["category-anime", genre, status, type, orderBy, page],
    queryFn: async ({ signal }) => {
      const order = ORDER[orderBy] ?? ORDER.rating;
      const isRating = order === ORDER.rating;

      const result = await jikanFetch("/anime", {
        signal,
        params: {
          page,
          limit: 24,
          sfw: "true",
          genres: genre,
          status,
          type,
          ...order,
          ...(isRating && !status ? { min_score: 1 } : {}),
        },
      });

      let animes = result.data || [];
      if (orderBy === "rating" || !ORDER[orderBy]) {
        animes = animes.filter((a) => a.score !== null && a.status !== "Not yet aired");
      }
      const unique = Array.from(new Map(animes.map((a) => [a.mal_id, a])).values());
      return { ...result, data: unique };
    },
    staleTime: 15 * 60 * 1000,
  });
}
