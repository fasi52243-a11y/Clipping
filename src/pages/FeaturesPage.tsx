import React from 'react';
import {
  Sparkles,
  Scissors,
  Smartphone,
  Layers,
  Volume2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          Engineered for Attention Retention
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white [text-wrap:balance]">
          Everything You Need to Win on Short-Form Video
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed [text-wrap:balance]">
          ClipForge AI combines multimodal Gemini intelligence with an in-browser media studio to cut,
          reframe, caption, and export high-converting short clips.
        </p>
      </div>

      {/* Feature 1: Viral Hook Detection */}
      <div id="hooks" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Multimodal Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            01. 3-Second Viral Hook Detection
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Viewers scroll past videos with boring openings in under two seconds.
            Our Gemini 3.8 Flash pipeline scans transcripts for contrarian statements,
            curiosity gaps, high-stakes questions, and emotional spikes, ensuring every clip starts with maximum momentum.
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>AI Viral Score (0-100) estimated on hook strength and retention pacing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Generates 4 alternative opening hook variations on demand</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 p-6 space-y-4">
            <div className="text-xs font-mono text-slate-400">ANALYZING DIALOGUE TRANSCRIPT...</div>
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs font-semibold text-white space-y-1">
              <div className="text-amber-400 text-[10px] uppercase font-mono">Hook Detected (0.0s - 3.2s)</div>
              <div>"The biggest mistake founders make after hitting $1M is thinking the same playbook gets them to $10M."</div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>HOOK STRENGTH: 96/100</span>
              <span className="text-emerald-400">HIGH ENGAGEMENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Smart Reframing */}
      <div id="reframing" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 lg:order-2 space-y-4">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Computer Vision
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            02. Smart Face Tracking & Reframing
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            No more ugly black bars or off-center speakers. ClipForge AI tracks the active speaker across
            widescreen 16:9 recordings and calculates optimal pan offsets to produce pristine 9:16 vertical video.
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full bleed 9:16 vertical crop with center-weighted speaker detection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Interactive crop offset slider for manual fine-tuning</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:order-1">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
            <img
              src="/src/assets/images/feature_smart_reframing_1794294828145.jpg"
              alt="Smart Reframing wide to vertical mobile"
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Feature 3: Dynamic Captions & Video Studio */}
      <div id="captions" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Audio-Visual Typography
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            03. Dynamic Burned-in Captions & Studio
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Select from 16 custom caption presets including Bold Impact, Podcast Studio, Cyber Neon,
            and Karaoke Sync. Customize colors, font sizes, positioning, and background pill boxes in real-time.
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Word-level sync highlights each syllable as it is spoken</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full multi-track timeline with trim, split, background beats, and watermark</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
            <img
              src="/src/assets/images/feature_dynamic_captions_1794294829014.jpg"
              alt="Dynamic Captions and timeline editor"
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
