"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";
import ContentViewer from "../components/ContentViewer";
import ScrollControls from "../components/ScrollControls";
import FloatingButton from "../components/FloatingButton";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useScrollSettings } from "../hooks/useScrollSettings";

function ReaderContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { settings, updateSettings } = useScrollSettings();
  const { isScrolling, toggle } = useAutoScroll({
    speed: settings.speed,
    enabled: settings.mode === "auto",
    scrollElement: scrollContainerRef.current,
  });

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No URL provided</p>
          <a href="/" className="text-purple-600 hover:underline">
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ScrollControls
        settings={settings}
        isScrolling={isScrolling}
        onSettingsChange={updateSettings}
        onToggleScroll={toggle}
      />
      
      <ContentViewer ref={scrollContainerRef} url={url} />
      
      <FloatingButton
        scrollAmount={settings.manualScrollAmount}
        enabled={settings.mode === "manual"}
        scrollElement={scrollContainerRef.current}
      />
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <ReaderContent />
    </Suspense>
  );
}
