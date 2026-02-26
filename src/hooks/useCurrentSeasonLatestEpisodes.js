import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";

export default function useCurrentSeasonLatestEpisodes(limit = 15) {
  return useQuery({
    queryKey: ["CurrentSeasonLatest", limit],
    queryFn: async () => {
      const seasonRes = await fetch(`${JIKAN_API_BASE}${JIKAN_ENDPOINTS.SEASONS_NOW}?limit=25&${JIKAN_QUERIES.SFW}`);
      if (!seasonRes.ok) throw new Error("Gagal ambil season now");
      const seasonJson = await seasonRes.json();

      const seasonMap = new Map(
        seasonJson.data.map((anime) => [anime.mal_id, anime])
      );

      const result = [];
      const seen = new Set();
      let page = 1;
      const maxPages = 3;

      while (page <= maxPages) {
        const epsRes = await fetch(`${JIKAN_API_BASE}${JIKAN_ENDPOINTS.WATCH_EPISODES}?limit=25&page=${page}`);

        if (!epsRes.ok) {
          if (epsRes.status === 429) throw new Error("Rate Limit, tunggu sebentar...");
          break;
        }

        const epsJson = await epsRes.json();
        const pageItems = (epsJson.data || [])
          .filter((item) => seasonMap.has(item.entry.mal_id))  
          .map((item) => {
            const fullAnime = seasonMap.get(item.entry.mal_id);

            return {
              mal_id: item.entry.mal_id,
              title: item.entry.title,
              images: item.entry.images,          
              latestEpisode: item.episodes[0] || null,

              year: fullAnime.year,
              score: fullAnime.score,
            };
          });

        // dedup
        for (const item of pageItems) {
          if (!seen.has(item.mal_id)) {
            seen.add(item.mal_id);
            result.push(item);
          }
        }

        page++;
      }

      return result.slice(0, limit);
    },

    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
