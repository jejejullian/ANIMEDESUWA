import { useQuery } from "@tanstack/react-query";
import { JIKAN_API_BASE, JIKAN_ENDPOINTS, JIKAN_QUERIES } from "@utils/constants";
import { enqueue } from "@utils/requestQueue";

const ITEMS_PER_PAGE = 24;

async function fetchAllSeasonNow() {
  // Fetch page 1 lewat antrian
  const firstData = await enqueue(async () => {
    const res = await fetch(
      `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.SEASONS_NOW}?page=1&limit=25&${JIKAN_QUERIES.SFW}`
    );
    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate Limit, tunggu sebentar ...");
      throw new Error("Gagal mengambil data season now");
    }
    return res.json();
  });

  const totalPages = firstData.pagination?.last_visible_page || 1;

  // Fetch page sisanya SERIAL lewat antrian
  const otherData = [];
  for (let p = 2; p <= totalPages; p++) {
    const pageData = await enqueue(async () => {
      const res = await fetch(
        `${JIKAN_API_BASE}${JIKAN_ENDPOINTS.SEASONS_NOW}?page=${p}&limit=25&${JIKAN_QUERIES.SFW}`
      );
      if (!res.ok) return { data: [] };
      return res.json();
    });
    otherData.push(...(pageData.data || []));
  }

  const allAnime = [...(firstData.data || []), ...otherData];

  // Filter & dedup
  const filtered = allAnime
    .filter((anime) => anime.status !== "Not yet aired" && anime.aired?.from !== null)
    .filter((anime, index, self) => index === self.findIndex((a) => a.title === anime.title));

  // Sort: airing dulu
  filtered.sort((a, b) => {
    if (a.airing && !b.airing) return -1;
    if (!a.airing && b.airing) return 1;
    return 0;
  });

  return filtered;
}

export default function useSeasonNow(page = 1) {
  const {
    data: allAnime = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["SeasonNowAll"],
    queryFn: fetchAllSeasonNow,
    staleTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // exponential backoff
  });

  const totalItems = allAnime.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const pageData = allAnime.slice(start, start + ITEMS_PER_PAGE);

  return {
    data: {
      data: pageData,
      pagination: {
        last_visible_page: totalPages,
        has_next_page: page < totalPages,
        current_page: page,
        items: { total: totalItems, count: pageData.length, per_page: ITEMS_PER_PAGE },
      },
    },
    isLoading,
    error,
    isFetching,
    isPlaceholderData: false,
  };
}