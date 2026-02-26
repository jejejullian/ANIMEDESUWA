export const JIKAN_API_BASE = 'https://api.jikan.moe/v4'

export const JIKAN_ENDPOINTS = {
  // Home
  TOP_ANIME: '/top/anime',
  SEASONS_NOW: '/seasons/now',
  SEASONS_UPCOMING: '/seasons/upcoming',
  SCHEDULES: '/schedules',
  TOP_AIRING: '/top/anime?filter=airing',

  // Watch / Latest
  WATCH_EPISODES: '/watch/episodes',

  // Detail
  ANIME_BY_ID: (id) => `/anime/${id}`,
  ANIME_FULL: (id) => `/anime/${id}/full`,
  ANIME_EPISODES: (id, page = 1) => `/anime/${id}/episodes?page=${page}`,
  ANIME_CHARACTERS: (id) => `/anime/${id}/characters`,
  ANIME_PICTURES: (id) => `/anime/${id}/pictures`,

  // Search & Browse
  ANIME_SEARCH: '/anime',
  GENRES: '/genres/anime',

  // Extras
  RANDOM_ANIME: '/random/anime',
  RECOMMENDATIONS: '/recommendations/anime',
};

// Query 
export const JIKAN_QUERIES = {
  SFW: 'sfw=true',
  LIMIT: (n) => `limit=${n}`,
};

// WATCHLIST STATUS
export const WATCHLIST_STATUS = {
  PLANNING: 'planning',
  WATCHING: 'watching',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  ON_HOLD: 'on_hold',
}

// Label untuk ditampilkan di UI
export const WATCHLIST_STATUS_LABEL = {
  planning: 'Plan to Watch',
  watching: 'Watching',
  completed: 'Completed',
  dropped: 'Dropped',
  on_hold: 'On Hold',
}


// ROUTES
export const ROUTES = {
  HOME: '/',
  ANIME_DETAIL: '/anime/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  WATCHLIST: '/watchlist',
  PROFILE: '/profile',
}

// PAGINATION
export const ITEMS_PER_PAGE = 20

// MISC
export const DEFAULT_ANIME_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image'