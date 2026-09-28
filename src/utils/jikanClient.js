import { JIKAN_API_BASE } from "./constants.js";

export const LIMITS = {
  minGapMs: 400, 
  windowMs: 60_000,
  maxPerWindow: 55, 
  maxRetries: 2, 
  breakerThreshold: 4, 
  breakerOpenMs: 30_000, 
  freshMs: 30 * 60_000, 
  maxStaleMs: 7 * 24 * 60 * 60_000, 
};

export class JikanError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "JikanError";
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const backoff = (attempt) => Math.min(1000 * 2 ** attempt, 8000) + Math.random() * 300;

let sentAt = [];
let cooldownUntil = 0; 
let circuitUntil = 0;
let failStreak = 0;
let chain = Promise.resolve();

export function _resetForTests() {
  sentAt = [];
  cooldownUntil = 0;
  circuitUntil = 0;
  failStreak = 0;
  chain = Promise.resolve();
}

/* ---------------- cache ---------------- */
const PREFIX = "jikan:v1:";
const store = () => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

function readCache(url) {
  try {
    const raw = store()?.getItem(PREFIX + url);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function pruneCache() {
  const s = store();
  if (!s) return;
  const entries = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (!k?.startsWith(PREFIX)) continue;
    let t = 0;
    try {
      t = JSON.parse(s.getItem(k)).t;
    } catch {
      /* entri rusak: t=0 -> dihapus duluan */
    }
    entries.push([k, t]);
  }
  entries
    .sort((a, b) => a[1] - b[1])
    .slice(0, Math.ceil(entries.length / 2))
    .forEach(([k]) => s.removeItem(k));
}

function writeCache(url, data) {
  const s = store();
  if (!s) return;
  const value = JSON.stringify({ t: Date.now(), d: data });
  try {
    s.setItem(PREFIX + url, value);
  } catch {
    pruneCache(); 
    try {
      s.setItem(PREFIX + url, value);
    } catch {
      /* menyerah, cache hanya optimasi */
    }
  }
}

/* ---------------- antrian rate limit ---------------- */
async function waitForSlot(signal) {
  for (;;) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const now = Date.now();
    while (sentAt.length && now - sentAt[0] >= LIMITS.windowMs) sentAt.shift();

    const last = sentAt[sentAt.length - 1] ?? 0;
    const wait = Math.max(cooldownUntil - now, last + LIMITS.minGapMs - now, sentAt.length >= LIMITS.maxPerWindow ? sentAt[0] + LIMITS.windowMs - now : 0, 0);

    if (wait === 0) {
      sentAt.push(now);
      return;
    }
    await sleep(wait);
  }
}

function acquireSlot(signal) {
  const p = chain.then(() => waitForSlot(signal));
  chain = p.catch(() => {});
  return p;
}

function noteFailure(waitMs) {
  failStreak++;
  cooldownUntil = Math.max(cooldownUntil, Date.now() + waitMs);
  if (failStreak >= LIMITS.breakerThreshold) {
    circuitUntil = Date.now() + LIMITS.breakerOpenMs;
    failStreak = LIMITS.breakerThreshold - 1; // setelah masa buka habis, satu kegagalan langsung membuka lagi
  }
}

export function buildUrl(path, params) {
  const base = JIKAN_API_BASE.replace(/\/+$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base + clean);
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}

function messageFor(status) {
  if (status === 404) return "Data tidak ditemukan";
  if (status === 429) return "Rate limit, tunggu sebentar...";
  if (status >= 500) return "Server Jikan sedang bermasalah, coba lagi nanti";
  return `Gagal mengambil data (status ${status})`;
}

const circuitError = () => new JikanError("Server Jikan sedang bermasalah, coba lagi beberapa saat lagi", 503);

export async function jikanFetch(path, { params, signal, ttl = LIMITS.freshMs } = {}) {
  const url = buildUrl(path, params);

  const cached = readCache(url);
  const age = cached ? Date.now() - cached.t : Infinity;
  if (cached && age < ttl) return cached.d;

  // Saat Jikan error: pakai data lama kalau ada, kalau tidak lempar error.
  const fallback = (err) => {
    if (cached && age < LIMITS.maxStaleMs) return cached.d;
    throw err;
  };

  for (let attempt = 0; ; attempt++) {
    if (Date.now() < circuitUntil) return fallback(circuitError());
    await acquireSlot(signal);
    if (Date.now() < circuitUntil) return fallback(circuitError());

    let res;
    try {
      res = await fetch(url, { signal });
    } catch (err) {
      if (err?.name === "AbortError") throw err;
      noteFailure(backoff(attempt));
      if (attempt < LIMITS.maxRetries) continue;
      return fallback(new JikanError("Tidak bisa terhubung ke Jikan API. Cek koneksi internet.", 0));
    }

    if (res.ok) {
      failStreak = 0;
      const data = await res.json();
      writeCache(url, data);
      return data;
    }

    if (res.status !== 429 && res.status < 500) {
      throw new JikanError(messageFor(res.status), res.status); 
    }

    const retryAfter = Number(res.headers.get("Retry-After"));
    noteFailure(retryAfter > 0 ? retryAfter * 1000 : backoff(attempt));
    if (attempt >= LIMITS.maxRetries) return fallback(new JikanError(messageFor(res.status), res.status));
  }
}
