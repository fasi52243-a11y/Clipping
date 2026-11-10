import React, { useState, useRef } from 'react';
import { UploadCloud, Film, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { SAMPLE_VIDEOS, SampleVideoDefinition } from '../../data/sampleVideos';
import { VideoMetadata } from '../../types';

interface VideoUploaderProps {
  onVideoSelected: (file: File | null, meta: VideoMetadata, sample?: SampleVideoDefinition) => void;
  isProcessing?: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoSelected,
  isProcessing = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);

    // Validate format
    const validExtensions = ['.mp4', '.mov', '.webm', '.m4v'];
    const lowerName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => lowerName.endsWith(ext)) || file.type.startsWith('video/');

    if (!isValidExt) {
      setErrorMsg('Please upload a valid video file (.mp4, .mov, or .webm)');
      return;
    }

    // Validate size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg('File size exceeds 500MB limit. Please choose a smaller video.');
      return;
    }

    setSelectedFileName(file.name);

    // Read video metadata via temporary video element
    const videoObjUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = videoObjUrl;

    tempVideo.onloadedmetadata = () => {
      const meta: VideoMetadata = {
        fileName: file.name,
        fileSize: file.size,
        duration: tempVideo.duration || 60,
        width: tempVideo.videoWidth || 1920,
        height: tempVideo.videoHeight || 1080,
        objectUrl: videoObjUrl,
        isSample: false,
      };
      onVideoSelected(file, meta);
    };

    tempVideo.onerror = () => {
      // Fallback metadata if browser can't decode codec immediately
      const meta: VideoMetadata = {
        fileName: file.name,
        fileSize: file.size,
        duration: 90,
        width: 1920,
        height: 1080,
        objectUrl: videoObjUrl,
        isSample: false,
      };
      onVideoSelected(file, meta);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleVideoDefinition) => {
    setSelectedFileName(sample.title);
    setErrorMsg(null);

    const meta: VideoMetadata = {
      fileName: `${sample.id}.mp4`,
      fileSize: 42 * 1024 * 1024,
      duration: sample.duration,
      width: 1920,
      height: 1080,
      isSample: true,
      sampleKey: sample.id,
    };

    onVideoSelected(null, meta, sample);
  };

  return (
    <div className="w-full space-y-6">
      {/* Drag & Drop File Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <span className="font-semibold text-slate-900 dark:text-white text-base">
              {selectedFileName ? 'Video selected:' : 'Choose a video file or drag & drop'}
            </span>
            {selectedFileName ? (
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                {selectedFileName}
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports MP4, MOV, WebM &middot; Up to 500MB &middot; Podcasts, Interviews, Webinars
              </p>
            )}
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors mt-2"
          >
            Browse Local File
          </button>
        </div>
      </div>

      {/* URL Import Box - With Required "Coming soon with backend" Notice */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Import from YouTube or Vimeo URL</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded px-1.5 py-0.2">
              Coming soon with backend
            </span>
          </label>
          <span className="text-[11px] text-slate-400">Browser local upload only</span>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed whitespace-nowrap"
          >
            Import URL
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Try with Sample Videos (Instant test without searching for files) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Or try instantly with a pre-recorded studio sample:</span>
          </span>
          <span className="text-slate-400">Click to select</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_VIDEOS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>{sample.category}</span>
                <span className="font-mono">{Math.floor(sample.duration / 60)}m {sample.duration % 60}s</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                {sample.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                Host: {sample.speaker}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
