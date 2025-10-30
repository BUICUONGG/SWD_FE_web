import { useEffect, useRef, useState } from 'react';

/**
 * Custom Hook: useFetch
 * Fetch dữ liệu từ API với caching, loading, error states
 */
export const useFetch = <T,>(
  url: string,
  options?: RequestInit
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, T>>(new Map());

  const fetchData = async () => {
    // Kiểm tra cache
    if (cacheRef.current.has(url)) {
      setData(cacheRef.current.get(url) || null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      cacheRef.current.set(url, result);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;
