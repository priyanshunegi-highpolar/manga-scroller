# Manga/Novel Auto-Scroller - Project Plan

## Project Overview
A web application that allows users to paste any website link and read content with customizable auto-scrolling functionality.

## Core Features

### 1. URL Input System
- Input field for users to paste website URLs
- URL validation
- Load external content within the app (using iframe or proxy)

### 2. Auto-Scroll Functionality
**Two Modes:**
- **Auto Mode**: Continuous scrolling at user-defined pace
- **Manual Mode**: Scroll on button press (scroll down incrementally without manual scrolling)

### 3. Control Panel
**Features:**
- Speed/pace slider (pixels per second or scroll speed levels)
- Play/Pause toggle for auto-scroll
- Manual scroll button (bottom-right floating button)
- Reset/Stop button
- Speed presets (Slow, Medium, Fast)

### 4. User Preferences
- Adjustable scroll speed
- Toggle between auto and manual modes
- Save preferences to localStorage
- Scroll increment size for manual mode

## Technical Architecture

### Frontend Structure
```
/app
  /page.tsx                 # Main landing page with URL input
  /reader/page.tsx          # Reader page with iframe and controls
  /components
    /URLInput.tsx           # URL input component
    /ScrollControls.tsx     # Control panel (speed, play/pause)
    /FloatingButton.tsx     # Bottom-right scroll button
    /ContentViewer.tsx      # Iframe wrapper for external content
  /hooks
    /useAutoScroll.ts       # Auto-scroll logic hook
    /useScrollSettings.ts   # Settings management hook
  /lib
    /scrollUtils.ts         # Scroll utility functions
```

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React hooks + Context API
- **Storage**: localStorage for preferences
- **Icons**: Lucide React or similar

## Implementation Phases

### Phase 1: Basic Setup
- [x] Next.js project initialized
- [ ] Create basic page structure
- [ ] Set up Tailwind CSS configuration
- [ ] Create component folder structure

### Phase 2: URL Input & Content Loading
- [ ] Build URL input component with validation
- [ ] Implement iframe-based content viewer
- [ ] Handle CORS issues (proxy solution if needed)
- [ ] Add loading states

### Phase 3: Auto-Scroll Core
- [ ] Create useAutoScroll hook
- [ ] Implement smooth scrolling logic
- [ ] Add speed control (pixels/second)
- [ ] Play/pause functionality

### Phase 4: Manual Scroll Button
- [ ] Create floating button component (bottom-right)
- [ ] Implement incremental scroll on press
- [ ] Add visual feedback (button animation)
- [ ] Ensure button stays visible during scroll

### Phase 5: Control Panel UI
- [ ] Speed slider component
- [ ] Mode toggle (auto/manual)
- [ ] Preset speed buttons
- [ ] Settings panel (collapsible/expandable)

### Phase 6: User Preferences
- [ ] localStorage integration
- [ ] Save/load user settings
- [ ] Default preferences
- [ ] Settings persistence across sessions

### Phase 7: Polish & UX
- [ ] Responsive design
- [ ] Keyboard shortcuts (Space for play/pause, Arrow keys)
- [ ] Smooth animations
- [ ] Error handling
- [ ] Loading indicators

## Key Components Breakdown

### 1. URLInput Component
```typescript
- Input field
- Submit button
- URL validation
- Navigate to reader page with URL param
```

### 2. ContentViewer Component
```typescript
- Iframe wrapper
- Handle external content loading
- Scroll container management
- CORS handling
```

### 3. ScrollControls Component
```typescript
- Speed slider (1-100 range)
- Play/Pause button
- Mode selector (Auto/Manual)
- Speed presets
- Reset button
```

### 4. FloatingButton Component
```typescript
- Fixed position (bottom-right)
- Click handler for manual scroll
- Visual states (active/inactive)
- Smooth scroll animation
```

### 5. useAutoScroll Hook
```typescript
- Auto-scroll interval management
- Speed calculation
- Start/stop functions
- Scroll position tracking
```

## Scroll Logic

### Auto-Scroll Algorithm
```
1. User sets speed (e.g., 50 pixels/second)
2. Calculate interval: 1000ms / speed
3. Use setInterval to scroll incrementally
4. window.scrollBy(0, scrollAmount)
5. Stop at bottom or on pause
```

### Manual-Scroll Algorithm
```
1. User clicks floating button
2. Calculate scroll amount (e.g., 100-300px)
3. Smooth scroll down by amount
4. No continuous scrolling, only on click
```

## User Flow

1. **Landing Page**
   - User enters website URL
   - Click "Start Reading"

2. **Reader Page**
   - Content loads in iframe/viewer
   - Control panel visible (top or side)
   - Floating button visible (bottom-right)

3. **Reading Experience**
   - User adjusts speed via slider
   - Clicks play for auto-scroll OR
   - Uses floating button for manual scroll
   - Preferences saved automatically

## Challenges & Solutions

### Challenge 1: CORS Issues
**Solution**: 
- Use iframe with sandbox attributes
- Implement server-side proxy if needed
- Show warning for blocked content

### Challenge 2: Iframe Scrolling
**Solution**:
- Scroll the iframe content, not parent window
- Access iframe.contentWindow.scrollBy()
- Handle cross-origin restrictions

### Challenge 3: Different Website Layouts
**Solution**:
- Focus on scrollable content area
- Provide manual scroll amount adjustment
- Test with various manga/novel sites

## Future Enhancements
- Bookmark/save reading position
- Multiple URL tabs
- Dark/light theme
- Reading statistics
- Browser extension version
- Mobile app version

## File Structure Summary
```
manga-scroller/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── reader/
│   │   └── page.tsx                # Reader page
│   ├── components/
│   │   ├── URLInput.tsx
│   │   ├── ScrollControls.tsx
│   │   ├── FloatingButton.tsx
│   │   └── ContentViewer.tsx
│   ├── hooks/
│   │   ├── useAutoScroll.ts
│   │   └── useScrollSettings.ts
│   └── lib/
│       └── scrollUtils.ts
├── public/
├── plan.md                         # This file
└── README.md
```

## Next Steps
1. Review and approve this plan
2. Start with Phase 1: Basic Setup
3. Implement Phase 2: URL Input & Content Loading
4. Build core scrolling functionality (Phase 3 & 4)
5. Add UI controls and preferences (Phase 5 & 6)
6. Polish and test (Phase 7)
