"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
      {/* Logo - Top Left */}
      <Link
        href="/"
        className="fixed top-1 left-1 z-50 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Image
          src="/logoZ.png"
          alt="Manga Scroller"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>

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
