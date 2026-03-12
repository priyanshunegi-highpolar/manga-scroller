"use client";

import { useState, forwardRef } from "react";

interface ContentViewerProps {
  url: string;
}

const ContentViewer = forwardRef<HTMLDivElement, ContentViewerProps>(({ url }, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div ref={ref} className="w-full overflow-y-auto hide-scrollbar" style={{ height: '100vh' }}>
      {loading && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center max-w-md p-8">
            <p className="text-red-600 mb-4">Unable to load this website</p>
            <p className="text-sm text-gray-600 mb-4">
              This website may not allow embedding. Try opening it in a new tab instead.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Open in New Tab
            </a>
          </div>
        </div>
      )}

      <iframe
        src={url}
        className="w-full border-0"
        style={{ height: '50000px', minHeight: '50000px' }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        title="Content Viewer"
      />
    </div>
  );
});

ContentViewer.displayName = 'ContentViewer';

export default ContentViewer;
