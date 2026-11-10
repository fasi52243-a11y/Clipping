import React from 'react';
import { InteractiveProductDemo } from '../components/home/InteractiveProductDemo';
import { VideoUploader } from '../components/upload/VideoUploader';
import { CAPTION_PRESETS } from '../data/captionPresets';
import {
  Sparkles,
  Scissors,
  Smartphone,
  Layers,
  ArrowRight,
  CheckCircle2,
  Share2,
  Clock,
  Play,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const handleDirectVideoUpload = (file: File | null, meta: any, sample?: any) => {
    // Navigate to generator page with state or start project
    window.location.hash = '#/generate';
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Quiet text kicker - zero-pill discipline */}
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
            Powered by Gemini 3.8 Flash &middot; In-Browser Media Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
            Turn Long Videos Into Engaging Short Clips With AI
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
            Transform podcasts, interviews, webinars and long-form videos into professionally edited short videos in minutes.
          </p>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#/generate"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI Clips</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href="#/editor"
              className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
            >
              Open Studio Editor
            </a>
          </div>
        </div>

        {/* Hero Video Upload Container */}
        <div className="mt-12 max-w-3xl mx-auto">
          <VideoUploader onVideoSelected={handleDirectVideoUpload} />
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT DEMO SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            See the AI Engine in Real-Time Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Test the live audio synchronization, vertical smart reframing, and dynamic subtitle engine below.
          </p>
        </div>

        <InteractiveProductDemo />
      </section>

      {/* 3. HOW IT WORKS (Editorial numbering) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-16">
          <div className="text-center mb-12 space-y-2">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Streamlined Workflow
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              From Raw Recording to Viral Shorts in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                01. Upload or Select Sample
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Drag & Drop Long-form Video
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload your MP4, MOV, or WebM recording up to 500MB, or choose one of our studio presets to test immediately.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                02. Gemini AI Analysis
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Transcribe & Detect Viral Hooks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Gemini 3.8 Flash listens to the audio, identifies speaker shifts, rates hook strength, and cuts at natural sentence boundaries.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                03. Export Ready Clips
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Burn Captions & Smart Reframe
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Render vertical 9:16 video directly in your browser with animated word highlights, face centering, and one-click export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE SHOWCASE (Using generated imagery) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Feature 1: Smart Reframing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Smart Reframing
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Keep the Speaker Centered Automatically
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Horizontal 16:9 recordings look broken on mobile without intelligent reframing.
              ClipForge AI tracks active facial movement and center-weighted focal points to pan the vertical frame seamlessly.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Automatic subject centering for talking heads and interviews</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Manual drag slider to adjust horizontal crop offset (-50% to +50%)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero letterboxing: full bleed 9:16 vertical video output</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <img
                src="/src/assets/images/feature_smart_reframing_1794294828145.jpg"
                alt="Smart Reframing showing wide video to vertical mobile conversion"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Feature 2: Dynamic Captions & Multi-Track Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Timeline Studio & Dynamic Captions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              16 Viral Subtitle Presets with Word-Level Sync
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Over 85% of short-form viewers watch with sound muted. High-impact kinetic subtitles
              with bouncing keyword highlights keep watch times above the critical 30-second benchmark.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>16 original presets: Bold Impact, Podcast Studio, Cyber Neon, Creator Glow</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Editable words, timing boundaries, and color customization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Multi-track timeline with trim, split, background beats, and watermark</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
              <img
                src="/src/assets/images/feature_dynamic_captions_1794294829014.jpg"
                alt="Multi-track video editor timeline with vibrant subtitle blocks"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CAPTION PRESETS CAROUSEL PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Typography Library
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            16 Built-in Caption Presets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Engineered for high CTR on TikTok, YouTube Shorts, and Instagram Reels.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CAPTION_PRESETS.slice(0, 8).map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{preset.name}</span>
                <span className="text-[10px] text-indigo-500 font-mono">{preset.config.animationType}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 text-center font-bold text-xs truncate">
                <span style={{ color: preset.config.textColor }}>THE </span>
                <span style={{ color: preset.config.highlightColor }}>VIRAL </span>
                <span style={{ color: preset.config.textColor }}>MOMENT</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {preset.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SOCIAL PLATFORMS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Export Ready for Every Major Short-Form Channel
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span>TikTok (9:16)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>YouTube Shorts (9:16)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-amber-500" />
            <span>Instagram Reels (9:16)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Facebook Reels (9:16 / 4:5)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>LinkedIn Video (1:1 / 4:5)</span>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about AI video clip creation.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {[
            {
              q: 'How does Gemini select the viral short clips?',
              a: 'Gemini 3.8 Flash analyzes the dialogue transcript to detect emotional spikes, contrarian hooks, memorable stories, and complete thoughts, cutting cleanly at sentence boundaries to create standalone shorts.',
            },
            {
              q: 'Is there a file size limit for uploads?',
              a: 'You can upload local video files up to 500MB in MP4, MOV, or WebM format. Processing happens securely in your browser and through our proxy API.',
            },
            {
              q: 'Can I edit the captions and change fonts?',
              a: 'Yes, the full multi-track studio editor lets you edit word text, timing, font families, sizes, highlight colors, background boxes, and karaoke bounce animations with live sync.',
            },
            {
              q: 'Does it work with YouTube URL import directly?',
              a: 'Per platform terms, client-only apps cannot download external YouTube video streams directly in-browser. The URL box is labeled "Coming soon with backend", and local file uploads are fully supported.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5"
            >
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{item.q}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-indigo-600 dark:bg-indigo-950/80 border border-indigo-500/50 p-8 sm:p-14 text-center text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Turn Long Videos Into Viral Shorts?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Join creators, podcasters, and marketing teams saving 10+ hours on video editing each week.
            </p>
            <div className="pt-2">
              <a
                href="#/generate"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-indigo-950 font-bold text-sm rounded-xl shadow-lg hover:bg-indigo-50 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Start Generating Free</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
