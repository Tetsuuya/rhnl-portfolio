/**
 * Shares one in-flight/recent request between every caller (home, subpages, chatbot)
 * instead of hitting Supabase once per component. Failed requests are not cached.
 */
export const createRequestCache = <T>(ttlMs = 60_000) => {
  let promise: Promise<T> | null = null;
  let fetchedAt = 0;

  return {
    get(fetcher: () => Promise<T>): Promise<T> {
      if (!promise || Date.now() - fetchedAt > ttlMs) {
        fetchedAt = Date.now();
        promise = fetcher().catch((err) => {
          promise = null;
          throw err;
        });
      }
      return promise;
    },
    clear() {
      promise = null;
    },
  };
};
