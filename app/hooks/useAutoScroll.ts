import { useEffect, useRef, useState } from "react";
import { scrollBy, isAtBottom } from "../lib/scrollUtils";

interface UseAutoScrollOptions {
  speed: number; // pixels per second
  enabled: boolean;
  scrollElement: HTMLElement | null;
}

export const useAutoScroll = ({ speed, enabled, scrollElement }: UseAutoScrollOptions) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !isScrolling || !scrollElement) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const scrollAmount = speed / 60; // Convert to pixels per frame (60fps)
    
    intervalRef.current = setInterval(() => {
      if (isAtBottom(scrollElement)) {
        setIsScrolling(false);
        return;
      }
      scrollBy(scrollElement, scrollAmount, false);
    }, 1000 / 60);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [speed, enabled, isScrolling, scrollElement]);

  const start = () => setIsScrolling(true);
  const stop = () => setIsScrolling(false);
  const toggle = () => setIsScrolling((prev) => !prev);

  return { isScrolling, start, stop, toggle };
};
