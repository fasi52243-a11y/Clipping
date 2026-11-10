import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectItem, ClipItem, SubtitleItem, AspectRatioType, CaptionStyleConfig } from '../types';
import { StorageService } from '../services/storageService';
import { CAPTION_PRESETS, getCaptionPresetById } from '../data/captionPresets';
import { VideoRenderingService } from '../services/videoRenderingService';
import { syntheticVideoGenerator } from '../services/syntheticVideoService';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Scissors,
  Save,
  Download,
  Sliders,
  Type,
  Music,
  Image as ImageIcon,
  Settings,
  Smartphone,
  Monitor,
  Square,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoEditorPageProps {
  projectId?: string;
}

export const VideoEditorPage: React.FC<VideoEditorPageProps> = ({ projectId }) => {
  const { projects, refreshProjects, brandKits, activeBrandKit } = useApp();

  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(null);
  const [activeClipIndex, setActiveClipIndex] = useState<number>(0);
  const [activeClip, setActiveClip] = useState<ClipItem | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadTime, setPlayheadTime] = useState<number>(0); // relative to clip.start
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);

  // Studio Sidebar Tabs: 'media' | 'captions' | 'templates' | 'audio' | 'branding' | 'settings'
  const [activeTab, setActiveTab] = useState<'media' | 'captions' | 'templates' | 'audio' | 'branding' | 'settings'>('captions');

  // Selected subtitle in caption list for inspector
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<ClipItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStage, setExportStage] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playTimerRef = useRef<number | null>(null);

  // Load project on mount or when projects change
  useEffect(() => {
    let proj: ProjectItem | undefined;
    if (projectId) {
      proj = projects.find((p) => p.id === projectId);
    }
    if (!proj && projects.length > 0) {
      proj = projects[0];
    }

    if (proj) {
      setCurrentProject(proj);
      const clipIdx = proj.selectedClipId
        ? Math.max(0, proj.clips.findIndex((c) => c.id === proj?.selectedClipId))
        : 0;
      setActiveClipIndex(clipIdx);
      const initClip = proj.clips[clipIdx] || proj.clips[0];
      if (initClip) {
        setActiveClip(initClip);
        setPlayheadTime(0);
        setSelectedSubId(initClip.subtitles[0]?.id || null);
        // Initialize history
        setHistory([JSON.parse(JSON.stringify(initClip))]);
        setHistoryIndex(0);
      }
    }
  }, [projectId, projects]);

  // Update history snapshot
  const pushHistory = (clip: ClipItem) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(JSON.parse(JSON.stringify(clip)));
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setActiveClip(JSON.parse(JSON.stringify(prev)));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setActiveClip(JSON.parse(JSON.stringify(next)));
    }
  };

  // Modify active clip with history push
  const updateClip = (patch: Partial<ClipItem>) => {
    if (!activeClip) return;
    const updated = { ...activeClip, ...patch };
    setActiveClip(updated);
    pushHistory(updated);
  };

  // Switch active clip in project
  const handleSelectClip = (index: number) => {
    if (!currentProject || !currentProject.clips[index]) return;
    setActiveClipIndex(index);
    const clip = currentProject.clips[index];
    setActiveClip(clip);
    setPlayheadTime(0);
    setIsPlaying(false);
    setSelectedSubId(clip.subtitles[0]?.id || null);
    setHistory([JSON.parse(JSON.stringify(clip))]);
    setHistoryIndex(0);
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying || !activeClip) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    const interval = 1000 / 30; // 30 fps
    playTimerRef.current = window.setInterval(() => {
      setPlayheadTime((prev) => {
        const next = prev + (interval / 1000) * playbackSpeed;
        if (next >= activeClip.duration) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, activeClip, playbackSpeed]);

  // Render canvas frame on playhead / state update
  useEffect(() => {
    if (!activeClip || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dims = VideoRenderingService.getDimensions(activeClip.aspectRatio || '9:16', 0.65);
    if (canvas.width !== dims.width || canvas.height !== dims.height) {
      canvas.width = dims.width;
      canvas.height = dims.height;
    }

    const { width, height } = dims;
    const absCurrentTime = activeClip.start + playheadTime;

    // Draw synthetic studio frame
    const sampleTheme = currentProject?.videoMeta.sampleKey?.includes('ai')
      ? 'keynote'
      : currentProject?.videoMeta.sampleKey?.includes('creator')
      ? 'podcast'
      : 'interview';

    syntheticVideoGenerator.drawFrame(sampleTheme, absCurrentTime, activeClip.title, 'Speaker');

    const synCanvas = syntheticVideoGenerator.getCanvas();
    const synAspect = synCanvas.width / synCanvas.height;
    const targetAspect = width / height;

    let sWidth = synCanvas.width;
    let sHeight = synCanvas.height;
    let sx = 0;
    let sy = 0;

    if (synAspect > targetAspect) {
      sWidth = sHeight * targetAspect;
      const maxShift = synCanvas.width - sWidth;
      const offsetRatio = (activeClip.cropOffsetX || 0) / 100;
      sx = Math.max(0, Math.min(maxShift, maxShift / 2 + offsetRatio * maxShift));
    } else {
      sHeight = sWidth / targetAspect;
      sy = (synCanvas.height - sHeight) / 2;
    }

    // Draw video background
    ctx.drawImage(synCanvas, sx, sy, sWidth, sHeight, 0, 0, width, height);

    // Draw Dynamic Subtitles
    VideoRenderingService.drawCaptionsOnCanvas(ctx, activeClip, absCurrentTime, width, height);

    // Draw Watermark
    if (activeClip.watermarkEnabled) {
      VideoRenderingService.drawWatermark(ctx, activeClip, width, height);
    }
  }, [activeClip, playheadTime, currentProject]);

  // Save changes to IndexedDB
  const handleSaveProject = async () => {
    if (!currentProject || !activeClip) return;
    try {
      setSaveStatus('Saving...');
      const updatedClips = [...currentProject.clips];
      updatedClips[activeClipIndex] = activeClip;

      const updatedProject: ProjectItem = {
        ...currentProject,
        clips: updatedClips,
        selectedClipId: activeClip.id,
      };

      await StorageService.saveProject(updatedProject);
      await refreshProjects();
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      console.error('Error saving project:', e);
      setSaveStatus('Error saving');
    }
  };

  // Real browser render and download
  const handleExport = async () => {
    if (!activeClip || !currentProject) return;

    try {
      setIsExporting(true);
      setExportProgress(5);
      setExportStage('Setting up studio canvas...');

      const blob = await VideoRenderingService.renderClipToBlob(
        activeClip,
        null,
        Boolean(currentProject.videoMeta.isSample),
        currentProject.videoMeta.sampleKey,
        {
          aspectRatio: activeClip.aspectRatio,
          includeCaptions: true,
          includeWatermark: activeClip.watermarkEnabled,
          onProgress: (pct, stage) => {
            setExportProgress(pct);
            setExportStage(stage);
          },
        }
      );

      setIsExporting(false);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });

      const cleanTitle = activeClip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      VideoRenderingService.downloadBlob(blob, `clipforge-${cleanTitle}.webm`);
    } catch (e) {
      console.error('Export error:', e);
      setIsExporting(false);
    }
  };

  // Timeline Trim actions
  const handleTrimStart = (deltaSeconds: number) => {
    if (!activeClip) return;
    const newStart = Math.max(0, activeClip.start + deltaSeconds);
    if (newStart < activeClip.end - 3) {
      updateClip({
        start: newStart,
        duration: activeClip.end - newStart,
      });
      setPlayheadTime(0);
    }
  };

  const handleTrimEnd = (deltaSeconds: number) => {
    if (!activeClip) return;
    const newEnd = activeClip.end + deltaSeconds;
    if (newEnd > activeClip.start + 3) {
      updateClip({
        end: newEnd,
        duration: newEnd - activeClip.start,
      });
    }
  };

  // Split clip at current playhead
  const handleSplitClip = () => {
    if (!activeClip || !currentProject) return;
    const splitPoint = activeClip.start + playheadTime;
    if (splitPoint <= activeClip.start + 2 || splitPoint >= activeClip.end - 2) return;

    const clipPart1: ClipItem = {
      ...activeClip,
      id: `clip-${Date.now()}-a`,
      title: `${activeClip.title} (Part 1)`,
      end: splitPoint,
      duration: splitPoint - activeClip.start,
      subtitles: activeClip.subtitles.filter((s) => s.end <= splitPoint),
    };

    const clipPart2: ClipItem = {
      ...activeClip,
      id: `clip-${Date.now()}-b`,
      title: `${activeClip.title} (Part 2)`,
      start: splitPoint,
      duration: activeClip.end - splitPoint,
      subtitles: activeClip.subtitles.filter((s) => s.start >= splitPoint),
    };

    const updatedClips = [...currentProject.clips];
    updatedClips.splice(activeClipIndex, 1, clipPart1, clipPart2);

    setCurrentProject({
      ...currentProject,
      clips: updatedClips,
    });
    setActiveClip(clipPart1);
    pushHistory(clipPart1);
  };

  // Duplicate active clip
  const handleDuplicateClip = () => {
    if (!activeClip || !currentProject) return;
    const duplicated: ClipItem = {
      ...activeClip,
      id: `clip-${Date.now()}-dup`,
      title: `${activeClip.title} (Copy)`,
    };
    const updatedClips = [...currentProject.clips, duplicated];
    setCurrentProject({
      ...currentProject,
      clips: updatedClips,
    });
  };

  if (!currentProject || !activeClip) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mb-4">
          <Scissors className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">No active project found</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select a project from your dashboard or generate new AI clips to start editing in the studio.
        </p>
        <a
          href="#/generate"
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
        >
          Generate New Clips
        </a>
      </div>
    );
  }

  const currentPreset = getCaptionPresetById(activeClip.captionPreset || 'bold-impact');
  const captionConfig = { ...currentPreset.config, ...(activeClip.captionConfig || {}) };

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Studio Navigation Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between gap-4 select-none shrink-0">
        <div className="flex items-center gap-3">
          <a
            href="#/projects"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Projects"
          >
            <ChevronLeft className="w-4 h-4" />
          </a>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="truncate max-w-[200px] sm:max-w-xs">{currentProject.title}</span>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 rounded px-1.5 py-0.2">
                Clip {activeClipIndex + 1}/{currentProject.clips.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-xs">
              {activeClip.title}
            </div>
          </div>
        </div>

        {/* Clip selector tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
          {currentProject.clips.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handleSelectClip(i)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                i === activeClipIndex
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clip {i + 1}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Aspect ratio quick toggle */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 text-xs">
            {(['9:16', '1:1', '16:9'] as AspectRatioType[]).map((ar) => (
              <button
                key={ar}
                onClick={() => updateClip({ aspectRatio: ar })}
                className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                  activeClip.aspectRatio === ar
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ar}
              </button>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProject}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveStatus || 'Save'}</span>
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{exportProgress}%</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export Clip</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Studio Body: 3-column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Studio Tool Tabs (280px) */}
        <aside className="w-full lg:w-72 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
          {/* Tab Navigation Icons */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900 text-xs">
            {[
              { id: 'captions', label: 'Captions', icon: Type },
              { id: 'templates', label: 'Templates', icon: Sliders },
              { id: 'audio', label: 'Audio', icon: Music },
              { id: 'branding', label: 'Branding', icon: ImageIcon },
              { id: 'media', label: 'Media', icon: Layers },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1 text-[11px] font-medium transition-colors border-b-2 ${
                    activeTab === t.id
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* CAPTIONS TAB */}
            {activeTab === 'captions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Subtitle Segments</span>
                  <button
                    onClick={() => {
                      const newSub: SubtitleItem = {
                        id: `sub-${Date.now()}`,
                        start: activeClip.start + playheadTime,
                        end: Math.min(activeClip.end, activeClip.start + playheadTime + 3),
                        text: 'New subtitle text line',
                      };
                      updateClip({ subtitles: [...activeClip.subtitles, newSub] });
                      setSelectedSubId(newSub.id);
                    }}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Line</span>
                  </button>
                </div>

                {/* Subtitles list */}
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {activeClip.subtitles.map((sub, idx) => {
                    const isSelected = selectedSubId === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubId(sub.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>{formatTimecode(sub.start)} - {formatTimecode(sub.end)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateClip({
                                subtitles: activeClip.subtitles.filter((s) => s.id !== sub.id),
                              });
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={sub.text}
                          onChange={(e) => {
                            const updated = activeClip.subtitles.map((s) =>
                              s.id === sub.id ? { ...s, text: e.target.value } : s
                            );
                            updateClip({ subtitles: updated });
                          }}
                          className="w-full bg-slate-950/80 border border-slate-700/60 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-white">Preset Caption Styles</span>
                <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                  {CAPTION_PRESETS.map((p) => {
                    const isSelected = activeClip.captionPreset === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => updateClip({ captionPreset: p.id })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-950/50 ring-1 ring-indigo-500'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                          <span>{p.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400">{p.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AUDIO TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-4 text-xs">
                <span className="text-xs font-bold text-white">Audio & Background Music</span>

                {/* Video Dialogue Volume */}
                <div className="space-y-1.5 p-3 rounded-xl border border-slate-800 bg-slate-900">
                  <div className="flex justify-between text-slate-300">
                    <span>Clip Dialogue Volume</span>
                    <span className="font-mono">{Math.round((activeClip.volume ?? 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={activeClip.volume ?? 1}
                    onChange={(e) => updateClip({ volume: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Background Music Presets */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-semibold text-[11px]">Background Beat Presets</span>
                  {[
                    { id: 'bgm-lofi', title: 'Lofi Chill Beat', mood: 'Relaxed & focus' },
                    { id: 'bgm-synth', title: 'Upbeat Tech Synth', mood: 'Fast & viral' },
                    { id: 'bgm-corporate', title: 'Ambient Corporate', mood: 'Professional' },
                    { id: 'bgm-podcast', title: 'Podcast Groove', mood: 'Subtle bass' },
                  ].map((bgm) => (
                    <button
                      key={bgm.id}
                      onClick={() =>
                        updateClip({
                          backgroundAudio: {
                            id: bgm.id,
                            title: bgm.title,
                            url: '#',
                            volume: 0.25,
                            fadeIn: true,
                            fadeOut: true,
                            ducking: true,
                          },
                        })
                      }
                      className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        activeClip.backgroundAudio?.id === bgm.id
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs">{bgm.title}</div>
                        <div className="text-[10px] text-slate-400">{bgm.mood}</div>
                      </div>
                      {activeClip.backgroundAudio?.id === bgm.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Auto Ducking Toggle */}
                {activeClip.backgroundAudio && (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900">
                    <div>
                      <div className="font-semibold text-white">Smart Ducking</div>
                      <div className="text-[10px] text-slate-400">Lower BGM while speech is active</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeClip.backgroundAudio.ducking}
                      onChange={(e) =>
                        updateClip({
                          backgroundAudio: {
                            ...activeClip.backgroundAudio!,
                            ducking: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 accent-indigo-500 rounded"
                    />
                  </div>
                )}
              </div>
            )}

            {/* BRANDING TAB */}
            {activeTab === 'branding' && (
              <div className="space-y-4 text-xs">
                <span className="text-xs font-bold text-white">Brand Watermark & Logo</span>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900">
                  <div>
                    <div className="font-semibold text-white">Show Watermark</div>
                    <div className="text-[10px] text-slate-400">Burn brand logo onto exported clip</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeClip.watermarkEnabled}
                    onChange={(e) => updateClip({ watermarkEnabled: e.target.checked })}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                </div>

                {activeClip.watermarkEnabled && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold text-[11px]">Position</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                          <button
                            key={pos}
                            onClick={() => updateClip({ watermarkPosition: pos as any })}
                            className={`p-2 rounded border text-center font-mono text-[11px] ${
                              activeClip.watermarkPosition === pos
                                ? 'border-indigo-500 bg-indigo-950/50 text-white'
                                : 'border-slate-800 bg-slate-900 text-slate-400'
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Opacity</span>
                        <span className="font-mono">{Math.round((activeClip.watermarkOpacity ?? 0.8) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1"
                        step="0.05"
                        value={activeClip.watermarkOpacity ?? 0.8}
                        onChange={(e) => updateClip({ watermarkOpacity: parseFloat(e.target.value) })}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
              <div className="space-y-4 text-xs">
                <span className="text-xs font-bold text-white">Source Video File</span>
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900 space-y-2">
                  <div className="font-semibold text-white truncate">{currentProject.videoMeta.fileName}</div>
                  <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                    <div>Duration: {Math.round(currentProject.videoMeta.duration)}s</div>
                    <div>Source Res: {currentProject.videoMeta.width}x{currentProject.videoMeta.height}</div>
                    <div>Source Type: {currentProject.videoMeta.isSample ? 'Studio Sample' : 'User Upload'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER COLUMN: Canvas Viewport & Multi-Track Timeline */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Studio Viewport Canvas Stage */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[360px] relative">
            <div className="relative shadow-2xl rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-h-[50vh] max-w-full object-contain"
              />

              {/* Aspect ratio frame guide */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 font-mono text-[10px] text-slate-400">
                {activeClip.aspectRatio}
              </div>
            </div>

            {/* Reframing Crop Offset Slider Bar */}
            <div className="mt-3 flex items-center gap-3 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800 text-xs text-slate-400">
              <span className="text-[11px]">Smart Center:</span>
              <input
                type="range"
                min="-50"
                max="50"
                value={activeClip.cropOffsetX || 0}
                onChange={(e) => updateClip({ cropOffsetX: parseInt(e.target.value, 10) })}
                className="w-32 sm:w-48 accent-indigo-500"
                title="Pan speaker frame left / right"
              />
              <span className="font-mono text-[10px] w-8">{activeClip.cropOffsetX || 0}%</span>
            </div>
          </div>

          {/* Central Playback Controls Bar */}
          <div className="h-12 border-t border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between text-xs shrink-0">
            {/* Left: Timecode Display */}
            <div className="flex items-center gap-2 font-mono text-slate-300">
              <span className="text-white font-bold">{formatTimecode(playheadTime)}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{formatTimecode(activeClip.duration)}</span>
            </div>

            {/* Center: Play/Pause and Step buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlayheadTime((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Step Back 1s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => setPlayheadTime((prev) => Math.min(activeClip.duration, prev + 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Step Forward 1s"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Tools & Volume */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSplitClip}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold"
                title="Split clip at playhead"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>

              <button
                onClick={handleDuplicateClip}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                title="Duplicate clip"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MULTI-TRACK TIMELINE (Interactive) */}
          <div className="h-56 border-t border-slate-800 bg-slate-950 p-3 space-y-2 select-none overflow-x-auto shrink-0">
            {/* Timeline Playhead Scrubber Slider */}
            <div className="relative w-full">
              <input
                type="range"
                min="0"
                max={activeClip.duration}
                step="0.05"
                value={playheadTime}
                onChange={(e) => setPlayheadTime(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-ew-resize"
              />
            </div>

            {/* Track 1: Video Track */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-[10px] font-bold text-slate-400 truncate">VIDEO</span>
              <div className="flex-1 relative h-9 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex items-center px-3">
                <div className="absolute inset-0 bg-indigo-950/40 border-l-4 border-r-4 border-indigo-500 rounded flex items-center justify-between px-2">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {activeClip.title}
                  </span>
                  <span className="font-mono text-[10px] text-indigo-300">
                    {activeClip.duration.toFixed(1)}s
                  </span>
                </div>
              </div>
            </div>

            {/* Track 2: Subtitles Track */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-[10px] font-bold text-slate-400 truncate">CAPTIONS</span>
              <div className="flex-1 relative h-9 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex items-center">
                {activeClip.subtitles.map((sub) => {
                  const subRelStart = Math.max(0, sub.start - activeClip.start);
                  const subRelEnd = Math.min(activeClip.duration, sub.end - activeClip.start);
                  const leftPct = (subRelStart / activeClip.duration) * 100;
                  const widthPct = Math.max(2, ((subRelEnd - subRelStart) / activeClip.duration) * 100);

                  const isSelected = selectedSubId === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubId(sub.id);
                        setPlayheadTime(subRelStart);
                      }}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      className={`absolute h-7 rounded px-1.5 flex items-center cursor-pointer text-[10px] font-semibold truncate transition-colors ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-300'
                          : 'bg-indigo-700/80 hover:bg-indigo-600 text-white'
                      }`}
                      title={sub.text}
                    >
                      {sub.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track 3: B-Roll & Visual Overlays */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-[10px] font-bold text-slate-400 truncate">B-ROLL</span>
              <div className="flex-1 relative h-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center px-3 text-[11px] text-slate-500">
                <span>Overlay tracks & Gemini B-roll suggestions available</span>
              </div>
            </div>

            {/* Track 4: Audio Track */}
            <div className="flex items-center gap-2">
              <span className="w-16 text-[10px] font-bold text-slate-400 truncate">AUDIO BGM</span>
              <div className="flex-1 relative h-9 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex items-center px-3">
                {activeClip.backgroundAudio ? (
                  <div className="absolute inset-0 bg-emerald-950/40 border border-emerald-700/50 rounded flex items-center justify-between px-3 text-xs text-emerald-300 font-medium">
                    <span>{activeClip.backgroundAudio.title}</span>
                    <span className="font-mono text-[10px]">
                      Vol: {Math.round(activeClip.backgroundAudio.volume * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500">No background beat selected</span>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Contextual Inspector (280px) */}
        <aside className="w-full lg:w-72 border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto space-y-4 shrink-0 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white">Inspector & Styling</span>
            <span className="text-[10px] text-indigo-400 font-mono">Live Sync</span>
          </div>

          {/* Subtitle Font & Appearance */}
          <div className="space-y-3">
            <span className="text-slate-400 font-semibold text-[11px]">Caption Typography</span>

            {/* Font Size */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Font Size</span>
                <span className="font-mono">{captionConfig.fontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="72"
                value={captionConfig.fontSize}
                onChange={(e) =>
                  updateClip({
                    captionConfig: {
                      ...captionConfig,
                      fontSize: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Text Color & Highlight Color */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px]">Text Color</span>
                <input
                  type="color"
                  value={captionConfig.textColor}
                  onChange={(e) =>
                    updateClip({
                      captionConfig: {
                        ...captionConfig,
                        textColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-8 rounded bg-slate-800 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px]">Highlight Color</span>
                <input
                  type="color"
                  value={captionConfig.highlightColor}
                  onChange={(e) =>
                    updateClip({
                      captionConfig: {
                        ...captionConfig,
                        highlightColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-8 rounded bg-slate-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Position Y Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Vertical Position</span>
                <span className="font-mono">{captionConfig.positionY}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={captionConfig.positionY}
                onChange={(e) =>
                  updateClip({
                    captionConfig: {
                      ...captionConfig,
                      positionY: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Animation / Karaoke type */}
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px]">Highlight Animation</span>
              <div className="grid grid-cols-3 gap-1">
                {(['bounce', 'karaoke', 'glow'] as const).map((anim) => (
                  <button
                    key={anim}
                    onClick={() =>
                      updateClip({
                        captionConfig: {
                          ...captionConfig,
                          animationType: anim,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded border text-center font-medium capitalize text-[10px] ${
                      captionConfig.animationType === anim
                        ? 'border-indigo-500 bg-indigo-950 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {anim}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Clip Trimming Controls */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="text-slate-400 font-semibold text-[11px]">Clip Boundaries</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Start</span>
                <span className="font-mono font-bold text-white">{activeClip.start.toFixed(1)}s</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">End</span>
                <span className="font-mono font-bold text-white">{activeClip.end.toFixed(1)}s</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleTrimStart(1)}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium"
              >
                +1s Start
              </button>
              <button
                onClick={() => handleTrimEnd(1)}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium"
              >
                +1s End
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
