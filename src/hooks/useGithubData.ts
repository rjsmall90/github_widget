import { useState, useEffect } from "react";
import { fetchGithubData } from "../services/github";
import type { GithubData } from "../types/github";

interface UseGithubDataResult {
  data: GithubData | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, { data: GithubData; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useGithubData(username: string, token?: string): UseGithubDataResult {
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cacheKey = `${username}:${token ?? ""}`;
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        if (!cancelled) {
          setData(cached.data);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchGithubData(username, token);
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username, token]);

  return { data, loading, error };
}
