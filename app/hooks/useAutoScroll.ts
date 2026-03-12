import { useEffect, useRef, useState, useCallback } from "react";
import { isAtBottom } from "../lib/scrollUtils";

interface UseAutoScrollOptions {
  speed: number; // pixels per second
  enabled: boolean;
  scrollElement: HTMLElement | null;
}

export const useAutoScroll = ({
  speed,
  enabled,
  scrollElement,
}: UseAutoScrollOptions) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  // Refs so event listeners always see latest state without stale closures
  const isScrollingRef = useRef(false);
  const isPausedRef = useRef(false);
  const touchStartYRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => { isScrollingRef.current = isScrolling; }, [isScrolling]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Smooth rAF animation loop
  useEffect(() => {
    if (!enabled || !isScrolling || isPaused || !scrollElement) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      }
      lastTimeRef.current = 0;
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animFrameRef.current = requestAnimationFrame(step);
        return;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (isAtBottom(scrollElement)) {
        setIsScrolling(false);
        return;
      }

      // Cap delta to avoid jumps when the tab was backgrounded
      const clampedDelta = Math.min(delta, 100);
      scrollElement.scrollTop += (speed * clampedDelta) / 1000;

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [speed, enabled, isScrolling, isPaused, scrollElement]);

  // Direction-based pause / resume using wheel + touch events
  useEffect(() => {
    if (!scrollElement || !enabled) return;

    // Mouse wheel — most reliable direction signal
    const onWheel = (e: WheelEvent) => {
      if (!isScrollingRef.current) return;

      if (e.deltaY < 0) {
        // Scrolling UP → pause
        if (!isPausedRef.current) {
          setIsPaused(true);
        }
      } else if (e.deltaY > 0) {
        // Scrolling DOWN → resume
        if (isPausedRef.current) {
          setIsPaused(false);
        }
      }
    };

    // Touch — track swipe direction
    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isScrollingRef.current) return;
      const dy = e.touches[0].clientY - touchStartYRef.current;

      if (dy > 8) {
        // Swiping finger DOWN = content scrolls UP → pause
        if (!isPausedRef.current) setIsPaused(true);
      } else if (dy < -8) {
        // Swiping finger UP = content scrolls DOWN → resume
        if (isPausedRef.current) setIsPaused(false);
      }
      // Update reference each move so direction changes mid-swipe work
      touchStartYRef.current = e.touches[0].clientY;
    };

    scrollElement.addEventListener("wheel", onWheel, { passive: true });
    scrollElement.addEventListener("touchstart", onTouchStart, { passive: true });
    scrollElement.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      scrollElement.removeEventListener("wheel", onWheel);
      scrollElement.removeEventListener("touchstart", onTouchStart);
      scrollElement.removeEventListener("touchmove", onTouchMove);
    };
  }, [scrollElement, enabled]);

  const start = useCallback(() => {
    setIsPaused(false);
    setIsScrolling(true);
  }, []);

  const stop = useCallback(() => {
    setIsPaused(false);
    setIsScrolling(false);
  }, []);

  const toggle = useCallback(() => {
    setIsScrolling((prev) => {
      if (prev) setIsPaused(false);
      return !prev;
    });
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return { isScrolling, isPaused, start, stop, toggle, resume };
};
