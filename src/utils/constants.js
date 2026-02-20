// src/utils/constants.js

// ==============================
// JIKAN API
// ==============================
export const JIKAN_API_BASE = 'https://api.jikan.moe/v4'

// Endpoints (biar gak salah ketik)
export const JIKAN_ENDPOINTS = {
  // Home
  TOP_ANIME: '/top/anime',
  SEASON_NOW: 'filter=airing&sfw=true&limit=24',
  SEASON_UPCOMING: '/seasons/upcoming',
  SCHEDULES: '/schedules',

  // Browse & Search
  ANIME_SEARCH: '/anime',
  GENRES: '/genres/anime',

  // Detail
  ANIME_BY_ID: (id) => `/anime/${id}`,
  ANIME_CHARACTERS: (id) => `/anime/${id}/characters`,
  ANIME_EPISODES: (id, page = 1) => `/anime/${id}/episodes?page=${page}`,
  ANIME_PICTURES: (id) => `/anime/${id}/pictures`,

  // Extras
  RANDOM_ANIME: '/random/anime',
  RECOMMENDATIONS: '/recommendations/anime',
}

// ==============================
// WATCHLIST STATUS
// ==============================
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

// ==============================
// ROUTES
// ==============================
export const ROUTES = {
  HOME: '/',
  ANIME_DETAIL: '/anime/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  WATCHLIST: '/watchlist',
  PROFILE: '/profile',
}

// ==============================
// PAGINATION
// ==============================
export const ITEMS_PER_PAGE = 20

// ==============================
// MISC
// ==============================
export const DEFAULT_ANIME_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image'