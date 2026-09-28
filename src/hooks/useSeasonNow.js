import { useQuery } from "@tanstack/react-query";
import { JIKAN_ENDPOINTS } from "@utils/constants";
import { jikanFetch } from "@utils/jikanClient";

const ITEMS_PER_PAGE = 24;
const MAX_PAGES = 10; // pengaman: jangan pernah menembak puluhan halaman

async function fetchAllSeasonNow(signal) {
  const fetchPage = (page) =>
    jikanFetch(JIKAN_ENDPOINTS.SEASONS_NOW, { signal, params: { page, limit: 25, sfw: "true" } });

  const first = await fetchPage(1);
  const totalPages = Math.min(first.pagination?.last_visible_page || 1, MAX_PAGES);

  const rest = [];
  for (let p = 2; p <= totalPages; p++) {
    try {
      rest.push(...((await fetchPage(p)).data || []));
    } catch (err) {
      if (err?.name === "AbortError") throw err;
      break; // halaman belakang gagal: tampilkan yang sudah ada daripada gagal total
    }
  }

  const filtered = [...(first.data || []), ...rest]
    .filter((a) => a.status !== "Not yet aired" && a.aired?.from !== null)
    .filter((a, i, self) => i === self.findIndex((b) => b.title === a.title));

  filtered.sort((a, b) => (a.airing === b.airing ? 0 : a.airing ? -1 : 1));
  return filtered;
}

export default function useSeasonNow(page = 1) {
  const { data: allAnime = [], isLoading, error, isFetching } = useQuery({
    queryKey: ["SeasonNowAll"],
    queryFn: ({ signal }) => fetchAllSeasonNow(signal),
    staleTime: 30 * 60 * 1000,
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
