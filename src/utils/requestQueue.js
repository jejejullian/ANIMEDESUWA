const JIKAN_RATE_LIMIT_DELAY = 400;

let queue = Promise.resolve();

export function enqueue(fn) {
  const result = queue.then(() => fn());
  queue = result.then(() => delay(JIKAN_RATE_LIMIT_DELAY)).catch(() => delay(JIKAN_RATE_LIMIT_DELAY));
  return result;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
