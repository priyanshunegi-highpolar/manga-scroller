"use client";

import { ScrollSettings } from "../hooks/useScrollSettings";
import { useState, useEffect, useRef } from "react";

interface ScrollControlsProps {
  settings: ScrollSettings;
  isScrolling: boolean;
  onSettingsChange: (settings: Partial<ScrollSettings>) => void;
  onToggleScroll: () => void;
}

export default function ScrollControls({
  settings,
  isScrolling,
  onSettingsChange,
  onToggleScroll,
}: ScrollControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 16 }); // top-right by default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const speedPresets = [
    { label: "Slow", value: 100 },
    { label: "Medium", value: 250 },
    { label: "Fast", value: 400 },
  ];

  const manualSpeedPresets = [
    { label: "S", value: 100 },
    { label: "M", value: 200 },
    { label: "L", value: 350 },
  ];

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem("controlButtonPosition");
    if (saved) {
      try {
        setPosition(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!isExpanded) return;
      
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded]);

  // Save position
  const savePosition = (pos: { x: number; y: number }) => {
    localStorage.setItem("controlButtonPosition", JSON.stringify(pos));
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  // Handle drag move
  useEffect(() => {
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 56; // 56px is button width
      const maxY = window.innerHeight - 56;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleDragEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        savePosition(position);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDragMove);
      document.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, dragStart, position]);

  const handleButtonClick = () => {
    if (isDragging) return; // Don't trigger click if dragging
    
    if (settings.mode === "auto") {
      if (isScrolling) {
        // If scrolling, pause it
        onToggleScroll();
      } else {
        // If not scrolling, toggle panel
        setIsExpanded(!isExpanded);
      }
    } else {
      // Manual mode - just toggle panel
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Mobile Draggable Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleButtonClick}
        style={{
          right: position.x === 0 ? '16px' : 'auto',
          left: position.x !== 0 ? `${position.x}px` : 'auto',
          top: `${position.y}px`,
        }}
        className={`md:hidden fixed z-50 text-white p-3 rounded-full shadow-lg transition-colors ${
          isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'
        } ${
          settings.mode === "auto" && isScrolling
            ? "bg-red-500 hover:bg-red-600"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
        aria-label="Control button"
      >
        {settings.mode === "auto" && isScrolling ? (
          // Pause icon when auto-scrolling
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25v13.5m-7.5-13.5v13.5"
            />
          </svg>
        ) : (
          // Settings icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5"
            />
          </svg>
        )}
      </button>

      {/* Control Panel */}
      <div
        ref={panelRef}
        className={`fixed top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-3 z-40 transition-all duration-300 ${
          isExpanded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 md:translate-y-0 md:opacity-100"
        } w-[95%] md:w-auto`}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => onSettingsChange({ mode: "auto" })}
              className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.mode === "auto"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => onSettingsChange({ mode: "manual" })}
              className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.mode === "manual"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Manual
            </button>
          </div>

          {/* Auto Mode Controls */}
          {settings.mode === "auto" && (
            <>
              <div className="flex items-center gap-2 flex-1 md:min-w-[250px]">
                <label className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  {settings.speed}
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={settings.speed}
                  onChange={(e) => onSettingsChange({ speed: Number(e.target.value) })}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-1">
                {speedPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onSettingsChange({ speed: preset.value })}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsExpanded(false);
                  onToggleScroll();
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-green-500 hover:bg-green-600 text-white"
              >
                ▶ Play
              </button>
            </>
          )}

          {/* Manual Mode Controls */}
          {settings.mode === "manual" && (
            <>
              <div className="flex items-center gap-2 flex-1 md:min-w-[250px]">
                <label className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  {settings.manualScrollAmount}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="20"
                  value={settings.manualScrollAmount}
                  onChange={(e) => onSettingsChange({ manualScrollAmount: Number(e.target.value) })}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-1">
                {manualSpeedPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onSettingsChange({ manualScrollAmount: preset.value })}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-gray-600 text-center md:text-left whitespace-nowrap hidden md:block">
                Hold button ↓
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
