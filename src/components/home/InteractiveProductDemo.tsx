import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Pause, RefreshCw, Smartphone, Layers, Check } from 'lucide-react';

export const InteractiveProductDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWordIdx, setCurrentWordIdx] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<'bold' | 'minimal' | 'podcast' | 'neon'>('bold');
  const [aspectMode, setAspectMode] = useState<'9:16' | '16:9'>('9:16');

  const demoWords = [
    { text: 'THE', highlight: false },
    { text: 'BIGGEST', highlight: true },
    { text: 'MISTAKE', highlight: true },
    { text: 'FOUNDERS', highlight: false },
    { text: 'MAKE', highlight: false },
    { text: 'AFTER', highlight: false },
    { text: 'ONE MILLION', highlight: true },
  ];

  // Auto advance words when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % demoWords.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isPlaying, demoWords.length]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
      {/* Top Demo Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-white">Interactive Engine Demo</span>
          <span className="text-slate-400 hidden sm:inline">&middot; Live Audio-Synced Captions & Reframing</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Aspect toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setAspectMode('9:16')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                aspectMode === '9:16' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              9:16 Vertical
            </button>
            <button
              onClick={() => setAspectMode('16:9')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                aspectMode === '16:9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              16:9 Source
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>

      {/* Main visual simulator stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Video Frame Simulator */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            className={`relative bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center ${
              aspectMode === '9:16' ? 'w-64 sm:w-72 h-[420px]' : 'w-full max-w-lg h-[280px]'
            }`}
          >
            {/* Background Studio Animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-black pointer-events-none" />

            {/* Simulated Speaker Avatar */}
            <div className="relative flex flex-col items-center z-10 -mt-10">
              <div className="relative w-28 h-28 rounded-full border-2 border-indigo-500/80 bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg">
                {/* Speaker silhouette */}
                <div className="w-14 h-14 rounded-full bg-slate-400 mt-2" />
                <div className="absolute bottom-0 w-24 h-12 rounded-t-full bg-slate-600" />
                {/* Audio pulse ring */}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-25" />
                )}
              </div>

              {/* Speaker name */}
              <div className="mt-3 px-3 py-1 rounded bg-black/60 border border-slate-700 text-[11px] font-semibold text-slate-200">
                Elena Vance &middot; Founder
              </div>
            </div>

            {/* Smart Reframing Frame overlay */}
            <div className="absolute inset-4 border border-dashed border-indigo-400/30 rounded-lg pointer-events-none flex items-start justify-between p-2 text-[10px] text-indigo-300 font-mono">
              <span>AUTO FOCUS: ON</span>
              <span>CONFIDENCE 98%</span>
            </div>

            {/* Dynamic Captions rendered on video */}
            <div className="absolute bottom-8 left-4 right-4 text-center z-20">
              {selectedStyle === 'bold' && (
                <div className="text-xl sm:text-2xl font-black uppercase tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                  {demoWords.map((word, i) => (
                    <span
                      key={i}
                      className={`inline-block mx-1 transition-all duration-150 ${
                        i === currentWordIdx
                          ? 'text-yellow-400 scale-110 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                          : 'text-white'
                      }`}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              )}

              {selectedStyle === 'minimal' && (
                <div className="inline-block px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-sm font-semibold text-white drop-shadow">
                  {demoWords.map((word, i) => (
                    <span
                      key={i}
                      className={`inline-block mx-1 ${
                        i === currentWordIdx ? 'text-sky-400 font-bold' : 'text-slate-200'
                      }`}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              )}

              {selectedStyle === 'podcast' && (
                <div className="inline-block px-4 py-2 rounded-lg bg-black/90 border border-indigo-500/40 text-base font-bold text-white shadow-xl">
                  {demoWords.map((word, i) => (
                    <span
                      key={i}
                      className={`inline-block mx-1 ${
                        i === currentWordIdx ? 'text-cyan-400' : 'text-slate-300'
                      }`}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              )}

              {selectedStyle === 'neon' && (
                <div className="inline-block px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-500/60 font-mono text-sm uppercase text-emerald-300">
                  {demoWords.map((word, i) => (
                    <span
                      key={i}
                      className={`inline-block mx-1 ${
                        i === currentWordIdx ? 'text-emerald-100 bg-emerald-700 px-1 rounded' : 'text-emerald-400'
                      }`}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Simulated Watermark */}
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 border border-slate-700 text-[10px] font-mono text-slate-300">
              CLIPFORGE
            </div>
          </div>
        </div>

        {/* Right: Interactive Controls & Live Metrics */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Viral Score Breakdown */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">AI Viral Potential (Estimate)</span>
              <span className="font-mono text-base font-bold text-emerald-400">96 / 100</span>
            </div>

            {/* Score progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full w-[96%]" />
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Opening Hook Energy</span>
                <span className="font-mono text-emerald-400">Top 3%</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Sentence Cut Boundary</span>
                <span className="font-mono text-slate-300">Clean punctuation</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Recommended Platform</span>
                <span className="font-medium text-indigo-400">TikTok & Shorts</span>
              </div>
            </div>
          </div>

          {/* Live Caption Preset Switcher */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="text-xs font-semibold text-slate-300">Interactive Caption Styles</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setSelectedStyle('bold')}
                className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors ${
                  selectedStyle === 'bold'
                    ? 'border-indigo-500 bg-indigo-950/30 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>Bold Impact</span>
                {selectedStyle === 'bold' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setSelectedStyle('minimal')}
                className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors ${
                  selectedStyle === 'minimal'
                    ? 'border-indigo-500 bg-indigo-950/30 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>Minimal Clean</span>
                {selectedStyle === 'minimal' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setSelectedStyle('podcast')}
                className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors ${
                  selectedStyle === 'podcast'
                    ? 'border-indigo-500 bg-indigo-950/30 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>Podcast Studio</span>
                {selectedStyle === 'podcast' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                onClick={() => setSelectedStyle('neon')}
                className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors ${
                  selectedStyle === 'neon'
                    ? 'border-indigo-500 bg-indigo-950/30 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>Cyber Neon</span>
                {selectedStyle === 'neon' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
