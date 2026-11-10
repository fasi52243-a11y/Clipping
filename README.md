# ClipForge AI

ClipForge AI is a modern SaaS web application that transforms long-form videos (podcasts, interviews, webinars, speeches) into engaging, viral short clips formatted for TikTok, YouTube Shorts, Instagram Reels, and LinkedIn.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and powered server-side by Google's **Gemini 3.8 Flash** model via the `@google/genai` SDK.

---

## Architecture Overview

```
├── server.ts                       # Express backend server with Gemini 3.8 Flash API routes & Vite proxy
├── src/
│   ├── assets/images/              # High-fidelity studio & feature visual assets
│   ├── components/
│   │   ├── brand/Logo.tsx          # Original SVG logo & brand mark
│   │   ├── clips/ClipCard.tsx      # Interactive clip card with video preview & direct canvas render
│   │   ├── home/InteractiveDemo    # Animated reframing & subtitle simulation engine
│   │   ├── layout/Navbar.tsx       # 3-Zone top navigation with theme toggle & dropdowns
│   │   ├── layout/Footer.tsx       # Clean SaaS footer with legal & virality disclaimers
│   │   └── upload/                 # Video drag & drop, sample selector, clip config options
│   ├── context/AppContext.tsx      # Global theme, auth, and project state
│   ├── data/
│   │   ├── captionPresets.ts       # 16 customizable subtitle presets (Karaoke, Bold, Neon, etc.)
│   │   └── sampleVideos.ts         # 3 rich pre-recorded studio sample videos with transcripts
│   ├── pages/                      # All routes (Home, Generate, Editor, Library, Dashboard, etc.)
│   ├── services/
│   │   ├── geminiService.ts        # Client-side API caller for server routes (modular AI provider)
│   │   ├── smartReframingService.ts# Center-weighted focal tracking from 16:9 to 9:16
│   │   ├── storageService.ts       # IndexedDB & localStorage persistence for offline projects
│   │   ├── syntheticVideoService.ts# Animated canvas video & waveform generator for test videos
│   │   └── videoRenderingService.ts# Browser canvas video recorder with burned captions & export
│   └── types/index.ts              # Full TypeScript schemas for clips, projects, and styles
```

---

## Real Working Features vs Demo / Mock Features

### 🟢 100% Real Working Features

1. **AI Video Analysis with Gemini 3.8 Flash**:
   - Transcribes dialogue from long-form content.
   - Detects 3-second opening viral hooks, stories, questions, and actionable takeaways.
   - Computes an estimated AI Virality Potential Score (0–100) based on structural pacing.
   - Generates sentence-boundary subtitle tracks with start/end timestamps.
   - Server-side key security: `GEMINI_API_KEY` is kept exclusively on the server.
2. **In-Browser Video Rendering & Export**:
   - Uses an offscreen HTML5 `<canvas>`, Web Audio API, and `MediaRecorder` to trim and render video clips.
   - Automatically crops to 9:16 vertical, 1:1 square, or 16:9 widescreen with face centering.
   - Burns in styled subtitles with word highlights and bounce/karaoke animations.
   - Burns in brand watermarks and mixes audio.
   - Downloads real `.webm` / `.mp4` video files directly to the user's computer.
3. **Multi-Track Video Studio Editor**:
   - Video track with trim handles and split tool at playhead.
   - Interactive subtitle track: click to jump, edit words and timestamps live.
   - Audio BGM track: select royalty-free background beats, volume slider, ducking.
   - Undo and Redo stack with history snapshots.
   - Live canvas preview synchronized with playhead.
4. **Smart Reframing**:
   - Keeps talking heads centered during 9:16 vertical crop.
   - Interactive horizontal pan offset slider (`-50%` to `+50%`) with live preview guides.
5. **Dynamic Captions (16 Original Presets)**:
   - Presets include: Bold Impact, Minimal Clean, Podcast Studio, Creator Glow, Karaoke Sync, Cinematic Serif, Cyber Neon, TikTok Bouncy, Reel Punch, Pastel Warm, and more.
   - Fully customizable font size, text color, highlight color, vertical position, and bounce animation.
6. **Brand Kits**:
   - Save custom brand presets with colors, fonts, default caption styles, and watermark placements.
   - Persists across sessions.
7. **Offline-First Persistence (IndexedDB + localStorage)**:
   - Projects, clips, subtitle edits, and brand kits are saved in IndexedDB and survive page refreshes.
   - Pre-seeded with 3 realistic studio sample videos (SaaS scaling, AI keynote, creator podcast) so users can test immediately.
8. **Dark and Light Theme**:
   - Full Tailwind CSS v4 custom variant wiring (`@custom-variant dark`) with seamless contrast pairing across cards and navigation.

### 🟡 Clearly Labeled Demo / Simulated Features

Per project requirements, features that require permanent multi-tenant cloud backends or external payment processors are provided with functional local mock data:
1. **Direct YouTube / Vimeo URL Import**:
   - Labeled *"Coming soon with backend"*. Browser sandboxes cannot download external video streams without a specialized server worker.
2. **Payment Processing & Subscriptions**:
   - Pricing page includes interactive monthly/annual toggles and plan comparisons. Real credit card transactions are labeled demo.
3. **Team Workspace & Admin Console**:
   - Team member invite flow and invoice history operate with local state and are clearly labeled *"Demo / Simulated SaaS UI"*.
4. **Authentication**:
   - Clean auth service interface with 1-click test profiles (Solo Creator, Agency Admin), labeled *"Demo Mode"* and architected for quick drop-in Supabase / Firebase / OAuth connection.
