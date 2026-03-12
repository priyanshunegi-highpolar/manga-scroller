"use client";

import { useState, useRef, useEffect } from "react";
import { scrollBy } from "../lib/scrollUtils";

interface FloatingButtonProps {
  scrollAmount: number;
  enabled: boolean;
  scrollElement: HTMLElement | null;
}

export default function FloatingButton({ scrollAmount, enabled, scrollElement }: FloatingButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  const startScrolling = () => {
    if (!enabled || !scrollElement) return;
    
    setIsPressed(true);
    isScrollingRef.current = true;
    
    // Immediate first scroll
    scrollBy(scrollElement, scrollAmount, true);
    
    // Continue scrolling while pressed
    intervalRef.current = setInterval(() => {
      if (isScrollingRef.current && scrollElement) {
        scrollBy(scrollElement, scrollAmount, false);
      }
    }, 100);
  };

  const stopScrolling = () => {
    setIsPressed(false);
    isScrollingRef.current = false;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <button
      onMouseDown={startScrolling}
      onMouseUp={stopScrolling}
      onMouseLeave={stopScrolling}
      onTouchStart={startScrolling}
      onTouchEnd={stopScrolling}
      className={`fixed bottom-8 right-8 w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl transition-all duration-200 flex items-center justify-center z-50 ${
        isPressed ? "scale-90" : "scale-100"
      }`}
      aria-label="Scroll down"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
        />
      </svg>
    </button>
  );
}
