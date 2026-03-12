"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      new URL(url);
      router.push(`/reader?url=${encodeURIComponent(url)}`);
    } catch {
      setError("Please enter a valid URL");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <main className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Manga Scroller
          </h1>
          <p className="text-xl text-purple-200">
            Auto-scroll any manga or novel website at your own pace
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-purple-200 mb-2">
                Website URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/manga-chapter"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {error && (
                <p className="mt-2 text-sm text-red-300">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Reading
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="text-sm font-semibold text-purple-200 mb-3">Features:</h3>
            <ul className="space-y-2 text-sm text-purple-100">
              <li>• Auto-scroll with adjustable speed</li>
              <li>• Manual scroll button for precise control</li>
              <li>• Save your preferences</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
