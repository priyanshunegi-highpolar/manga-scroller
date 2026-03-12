# Manga Scroller — Audit Report

## ✅ Fixed Issues

### Performance
- **Smooth auto-scrolling**: Replaced `setInterval` + `scrollBy` with `requestAnimationFrame` and direct `scrollTop` manipulation for buttery smooth, frame-perfect scrolling.
- **Delta clamping**: Added clamping to avoid large scroll jumps when the tab was inactive and rAF fires with a large delta.

### PWA / Installability
- **Web App Manifest** (`/manifest.json`): Added with app name, icons, standalone display mode, and theme color.
- **Service Worker** (`/sw.js`): Network-first caching strategy for static assets — enables offline shell and install prompt.
- **PWA Registration** (`PWARegister.tsx`): Client component that registers the service worker and shows a custom install banner via `beforeinstallprompt`.
- **Apple Web App meta tags**: Added via Next.js `metadata.appleWebApp` for iOS home screen support.
- **Theme color**: Set to `#7c3aed` (purple) via `viewport` export.

### UX Improvements
- **Pause on scroll up / Resume on scroll down**: Auto-scroll now pauses when the user scrolls upward and resumes automatically when they scroll back down.
- **Paused indicator**: Mobile floating button turns amber with a play icon when auto-scroll is paused. Desktop panel button updates to show Resume/Pause/Play states.
- **Hidden scrollbar**: Reader scroll container uses `hide-scrollbar` CSS for a cleaner reading experience.
- **Overscroll containment**: `overscroll-behavior-y: contain` prevents pull-to-refresh and browser back gestures from interfering while reading.
- **Tap highlight removal**: Removed the default tap highlight color on mobile.
- **Safe area insets**: PWA install banner respects `env(safe-area-inset-bottom)` for notched devices.

### Security
- **URL protocol validation**: Both home page form and reader page now reject non-HTTP(S) URLs (blocks `javascript:`, `file:`, `data:` etc.).
- **Service worker scope**: Only caches same-origin requests.

### Code Quality
- **Package name**: Fixed from `my-app` to `manga-scroller`.
- **Open Graph metadata**: Added basic OG tags for better link previews.

---

## ⚠️ Needs Attention (Manual Steps Required)

### PWA Icons
- Current icons (`logoZ.png`, `logoX.png`) may not be the exact 192×192 and 512×512 sizes required by the PWA spec.
- **Action**: Generate properly sized PNG icons (192×192, 512×512) and update `manifest.json`.
- Consider adding a maskable icon variant with proper safe zone padding.

### Favicon
- No `favicon.ico` or SVG favicon configured.
- **Action**: Add a `/public/favicon.ico` and optionally a `/public/favicon.svg`.

---

## 📋 Future Improvements

### Performance
- **Iframe height hack**: The `50000px` iframe height is a memory-heavy hack. Consider dynamically resizing via `postMessage` or using an `IntersectionObserver`-based approach.
- **Image optimization**: Ensure logo images are served in modern formats (WebP/AVIF) and are properly sized.
- **Font subsetting**: Audit whether both Geist fonts are fully needed; consider reducing font weight range.

### Accessibility
- **Skip-to-content link**: Add a visually hidden skip link for keyboard users.
- **ARIA live regions**: Announce scroll state changes (play/pause/resume) to screen readers.
- **Focus management**: Ensure all interactive controls are keyboard-accessible and visible focus rings are present.
- **Reduced motion**: Respect `prefers-reduced-motion` by disabling auto-scroll animation.

### SEO
- **robots.txt**: Add a `/public/robots.txt` with sitemap reference.
- **Sitemap**: Generate a `sitemap.xml` for search engine indexing.
- **Structured data**: Add JSON-LD schema for the application.

### Offline / Caching
- **Offline fallback page**: Show a custom offline page when network is unavailable and content is not cached.
- **Dynamic caching**: Cache reader pages and frequently visited URLs for better offline support.
- **Cache versioning**: Implement a proper cache-busting strategy tied to build hashes.

### UX Enhancements
- **URL history**: Save recently visited URLs in localStorage for quick re-access.
- **Dark/light mode toggle**: Add an explicit theme toggle instead of relying on system preference only.
- **Speed label**: Show "px/s" unit next to the speed slider value.
- **Keyboard shortcuts**: Add keyboard shortcuts for play/pause (Space), speed up/down (arrow keys).
- **Progress bar**: Show a reading progress indicator (percentage or bar) based on scroll position.
- **Haptic feedback**: Use `navigator.vibrate()` for tactile feedback on mobile when pausing/resuming.

### Security Hardening
- **Content Security Policy**: Add CSP headers via `next.config.ts` to restrict resource loading.
- **Rate limiting**: Consider rate-limiting URL submissions to prevent abuse.
- **URL allowlist/blocklist**: Optionally restrict which domains can be loaded in the iframe.

### Testing
- **Unit tests**: Add tests for `useAutoScroll`, `useScrollSettings`, and `scrollUtils`.
- **E2E tests**: Add Playwright or Cypress tests for the reader flow.
- **Lighthouse CI**: Integrate Lighthouse audits into CI pipeline to catch regressions.

### DevOps
- **CI/CD**: Set up GitHub Actions for build, lint, and test on PRs.
- **Bundle analysis**: Add `@next/bundle-analyzer` to monitor bundle size.
- **Error tracking**: Integrate Sentry or similar for runtime error monitoring.
