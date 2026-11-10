import React, { useState, useRef } from 'react';
import { ClipItem, ProjectItem } from '../../types';
import { VideoRenderingService } from '../../services/videoRenderingService';
import { GeminiService, HookVariation } from '../../services/geminiService';
import {
  Play,
  Pause,
  Download,
  Scissors,
  Sparkles,
  Trash2,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClipCardProps {
  clip: ClipItem;
  project: ProjectItem;
  onOpenEditor: (clipId: string) => void;
  onDeleteClip?: (clipId: string) => void;
  onUpdateClip?: (updatedClip: ClipItem) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({
  clip,
  project,
  onOpenEditor,
  onDeleteClip,
  onUpdateClip,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(clip.start);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState('');
  const [renderedBlob, setRenderedBlob] = useState<Blob | null>(null);

  // Hook variation modal state
  const [hookModalOpen, setHookModalOpen] = useState(false);
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [hookVariations, setHookVariations] = useState<HookVariation[]>([]);

  // Simulation timer when playing
  const timerRef = useRef<number | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= clip.end) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return clip.start;
          }
          return prev + 0.5;
        });
      }, 500);
    }
  };

  // Real render to Blob in browser and download
  const handleRenderAndDownload = async () => {
    try {
      setIsRendering(true);
      setRenderProgress(5);
      setRenderStage('Preparing video canvas...');

      const blob = await VideoRenderingService.renderClipToBlob(
        clip,
        null, // uses high fidelity synthetic canvas or loaded video
        Boolean(project.videoMeta.isSample),
        project.videoMeta.sampleKey,
        {
          aspectRatio: clip.aspectRatio || '9:16',
          includeCaptions: true,
          includeWatermark: clip.watermarkEnabled,
          onProgress: (pct, stage) => {
            setRenderProgress(pct);
            setRenderStage(stage);
          },
        }
      );

      setRenderedBlob(blob);
      setIsRendering(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });

      // Auto trigger download
      const cleanTitle = clip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      VideoRenderingService.downloadBlob(blob, `clipforge-${cleanTitle}.webm`);
    } catch (err: any) {
      console.error('Render error:', err);
      setIsRendering(false);
    }
  };

  // Open Hook Variations Generator
  const handleOpenHookVariations = async () => {
    setHookModalOpen(true);
    setLoadingHooks(true);
    try {
      const variations = await GeminiService.getHookVariations(
        clip.hook,
        clip.title,
        clip.recommendedPlatform
      );
      setHookVariations(variations);
    } catch (e) {
      console.error('Error fetching hooks:', e);
    } finally {
      setLoadingHooks(false);
    }
  };

  const handleApplyHook = (newHookText: string) => {
    if (onUpdateClip) {
      onUpdateClip({
        ...clip,
        hook: newHookText,
      });
    }
    setHookModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      {/* Top Preview Canvas / Screen */}
      <div className="relative aspect-[9/10] bg-slate-950 flex items-center justify-center overflow-hidden group">
        {/* Dynamic visual preview */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-slate-900/60 to-black/40 flex flex-col items-center justify-center p-4 text-center">
          {/* Subtle animated sound ring */}
          <div className="w-20 h-20 rounded-full border border-indigo-500/40 bg-slate-800/80 flex items-center justify-center relative shadow-lg">
            <Smartphone className="w-8 h-8 text-indigo-400" />
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-30" />
            )}
          </div>

          {/* Active Subtitle preview */}
          <div className="mt-4 px-3 py-1.5 rounded-lg bg-black/75 border border-slate-800 text-xs font-bold text-white max-w-[90%] line-clamp-2">
            "{clip.hook}"
          </div>

          <div className="text-[11px] font-mono text-slate-400 mt-2">
            {clip.aspectRatio || '9:16'} &middot; {clip.recommendedPlatform}
          </div>
        </div>

        {/* Play / Pause button overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 z-20"
          aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {/* Score Badge */}
          <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-emerald-400">{clip.aiScore}</span>
            <span className="text-[10px] text-slate-400">AI Est.</span>
          </div>

          {/* Duration Badge */}
          <div className="bg-black/80 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200">
            {Math.round(clip.duration)}s
          </div>
        </div>

        {/* Timestamp Bar at Bottom */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded pointer-events-none">
          <span>{clip.start.toFixed(1)}s</span>
          <span>{clip.end.toFixed(1)}s</span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {clip.title}
          </h4>

          {/* Opening Hook Quote */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
              Opening Hook:
            </span>
            <p className="italic line-clamp-2">"{clip.hook}"</p>
          </div>

          {/* AI Score Explanation */}
          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">Why selected: </span>
            {clip.scoreExplanation}
          </div>
        </div>

        {/* Rendering Progress Modal Bar (if active) */}
        {isRendering && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Rendering MP4 Video...</span>
              </span>
              <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{renderProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-150"
                style={{ width: `${renderProgress}%` }}
              />
            </div>
            <div className="text-[10px] text-indigo-600/80 dark:text-indigo-300/80 truncate">
              {renderStage}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {/* Open in Editor */}
          <button
            onClick={() => onOpenEditor(clip.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Open in Editor</span>
          </button>

          {/* Download Clip */}
          <button
            onClick={handleRenderAndDownload}
            disabled={isRendering}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            title="Render and download full clip"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Hook Variations */}
          <button
            onClick={handleOpenHookVariations}
            className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Generate Alternative Viral Hooks"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </button>

          {/* Delete clip */}
          {onDeleteClip && (
            <button
              onClick={() => onDeleteClip(clip.id)}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Delete clip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Hook Variations Modal */}
      {hookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Viral Hook Variations (Gemini AI)
                </h3>
              </div>
              <button
                onClick={() => setHookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              The first 3 seconds decide whether viewers stay or swipe. Select an alternative opening hook formula:
            </p>

            {loadingHooks ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-xs text-slate-500">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Crafting viral hook formulas...</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {hookVariations.map((h, i) => (
                  <div
                    key={i}
                    onClick={() => handleApplyHook(h.text)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{h.formula}</span>
                      <span className="text-[10px] text-slate-400">Click to apply</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      "{h.text}"
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {h.rationale}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
