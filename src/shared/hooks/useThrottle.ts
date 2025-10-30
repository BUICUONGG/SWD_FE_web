import { useEffect, useRef, useState } from 'react';

/**
 * Custom Hook: useThrottle
 * Throttle một value trong một khoảng thời gian
 * Hữu ích cho scroll, resize events, etc.
 */
export const useThrottle = <T,>(value: T, delay: number = 500): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRanRef = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now >= lastRanRef.current + delay) {
      lastRanRef.current = now;
      setThrottledValue(value);
    } else {
      const timeoutId = setTimeout(() => {
        lastRanRef.current = Date.now();
        setThrottledValue(value);
      }, delay - (now - lastRanRef.current));

      return () => clearTimeout(timeoutId);
    }
  }, [value, delay]);

  return throttledValue;
};

export default useThrottle;
