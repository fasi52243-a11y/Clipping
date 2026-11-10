import React, { useState } from 'react';
import { VideoUploader } from '../components/upload/VideoUploader';
import { ClipConfigOptions, ClipConfigValues } from '../components/upload/ClipConfigOptions';
import { VideoMetadata, ProjectItem } from '../types';
import { SampleVideoDefinition } from '../data/sampleVideos';
import { StorageService } from '../services/storageService';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AiClipGeneratorPage: React.FC = () => {
  const { refreshProjects, user } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleVideoDefinition | null>(null);
  const [step, setStep] = useState<'upload' | 'configure'>('upload');

  const [configValues, setConfigValues] = useState<ClipConfigValues>({
    clipCount: 3,
    durationTarget: '30',
    platform: 'TikTok',
    aspectRatio: '9:16',
    language: 'English',
    captionStyle: 'bold-impact',
    category: 'Podcast & Interview',
    instructions: 'Focus on high energy hooks, actionable advice, and contrarian insights.',
  });

  const handleVideoSelected = (
    file: File | null,
    meta: VideoMetadata,
    sample?: SampleVideoDefinition
  ) => {
    setSelectedFile(file);
    setVideoMeta(meta);
    if (sample) {
      setSelectedSample(sample);
      setConfigValues((prev) => ({
        ...prev,
        category: sample.category,
      }));
    } else {
      setSelectedSample(null);
    }
    setStep('configure');
  };

  const handleStartProcessing = async () => {
    if (!videoMeta) return;

    const newProjectId = `proj_${Date.now()}`;
    const projectTitle = selectedSample?.title || videoMeta.fileName.replace(/\.[^/.]+$/, '');

    const newProject: ProjectItem = {
      id: newProjectId,
      title: projectTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'analyzing',
      videoMeta,
      transcript: selectedSample?.transcript || '',
      clips: selectedSample?.preconfiguredClips || [],
      brandKitId: 'brand-creator-pro',
      generationOptions: {
        ...configValues,
      },
    };

    // Save project in IndexedDB
    await StorageService.saveProject(newProject);
    if (selectedFile) {
      await StorageService.saveMediaBlob(newProjectId, selectedFile);
    }
    await refreshProjects();

    // Navigate to processing pipeline page
    window.location.hash = `#/processing/${newProjectId}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          Step-by-Step AI Workflow
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          AI Short Clips Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Upload any long-form video or pick a studio sample to automatically transcribe, detect hooks, and cut viral shorts.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium">
        <button
          onClick={() => setStep('upload')}
          className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
            step === 'upload'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-400'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-[10px]">1</span>
          <span>Upload Video</span>
        </button>

        <span className="text-slate-300 dark:text-slate-700">&rarr;</span>

        <button
          disabled={!videoMeta}
          onClick={() => videoMeta && setStep('configure')}
          className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors disabled:opacity-40 ${
            step === 'configure'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-400'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-[10px]">2</span>
          <span>Configure AI Cuts</span>
        </button>
      </div>

      {/* Content depending on active step */}
      {step === 'upload' && (
        <div className="animate-in fade-in duration-200">
          <VideoUploader onVideoSelected={handleVideoSelected} />
        </div>
      )}

      {step === 'configure' && videoMeta && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Selected Video Summary Strip */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 truncate">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                MP4
              </div>
              <div className="truncate">
                <div className="font-bold text-slate-900 dark:text-white truncate">
                  {selectedSample?.title || videoMeta.fileName}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Duration: {Math.round(videoMeta.duration)}s &middot; Res: {videoMeta.width}x{videoMeta.height}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('upload')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold shrink-0"
            >
              Change Video
            </button>
          </div>

          {/* Configuration Form */}
          <ClipConfigOptions
            values={configValues}
            onChange={setConfigValues}
            onSubmit={handleStartProcessing}
          />
        </div>
      )}
    </div>
  );
};
