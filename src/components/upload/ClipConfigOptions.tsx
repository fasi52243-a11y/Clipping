import React from 'react';
import { PlatformType, AspectRatioType } from '../../types';
import { CAPTION_PRESETS } from '../../data/captionPresets';
import { Sparkles, Sliders, Smartphone, Monitor, Square, Check, Info } from 'lucide-react';

export interface ClipConfigValues {
  clipCount: number;
  durationTarget: string;
  platform: PlatformType;
  aspectRatio: AspectRatioType;
  language: string;
  captionStyle: string;
  category: string;
  instructions: string;
}

interface ClipConfigOptionsProps {
  values: ClipConfigValues;
  onChange: (values: ClipConfigValues) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const ClipConfigOptions: React.FC<ClipConfigOptionsProps> = ({
  values,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const platforms: PlatformType[] = [
    'TikTok',
    'YouTube Shorts',
    'Instagram Reels',
    'Facebook Reels',
    'LinkedIn',
  ];

  const durations = ['15s', '30s', '45s', '60s', '90s'];

  const aspectRatios: { id: AspectRatioType; label: string; desc: string; icon: any }[] = [
    { id: '9:16', label: '9:16 Vertical', desc: 'TikTok, Shorts, Reels', icon: Smartphone },
    { id: '1:1', label: '1:1 Square', desc: 'Instagram, LinkedIn feed', icon: Square },
    { id: '16:9', label: '16:9 Landscape', desc: 'YouTube, Web desktop', icon: Monitor },
    { id: '4:5', label: '4:5 Portrait', desc: 'Facebook & IG Feed', icon: Smartphone },
  ];

  const categories = [
    'Podcast & Interview',
    'Keynote & Speech',
    'Educational & Tutorial',
    'Business & SaaS',
    'Comedy & Entertainment',
    'Storytelling & Vlog',
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Portuguese',
    'Hindi',
    'Japanese',
    'Italian',
  ];

  const update = (patch: Partial<ClipConfigValues>) => {
    onChange({ ...values, ...patch });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>AI Clip Generation Settings</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize target platforms, clip durations, caption aesthetics, and prompt guidelines.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-mono">
          <span>Cost:</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{values.clipCount} Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Target Platform */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Target Platform
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update({ platform: p })}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                  values.platform === p
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Target Aspect Ratio */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Output Aspect Ratio (Smart Reframing)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {aspectRatios.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update({ aspectRatio: item.id })}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                    values.aspectRatio === item.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                  <div className="truncate">
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Number of Clips */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex justify-between">
            <span>Clips to Generate</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">{values.clipCount} Clips</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 3, 5, 8].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => update({ clipCount: count })}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  values.clipCount === count
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                {count} {count === 1 ? 'Clip' : 'Clips'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Clip Target Duration */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Target Duration
          </label>
          <div className="flex items-center gap-2">
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => update({ durationTarget: d.replace('s', '') })}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  values.durationTarget === d.replace('s', '')
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Category & Content Focus */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Video Category
          </label>
          <select
            value={values.category}
            onChange={(e) => update({ category: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 6. Language */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Spoken Language
          </label>
          <select
            value={values.language}
            onChange={(e) => update({ language: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 7. Caption Style Presets */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>Burned-in Caption Preset</span>
          <span className="text-[11px] text-slate-400">16 customizable styles</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
          {CAPTION_PRESETS.slice(0, 8).map((preset) => {
            const isSelected = values.captionStyle === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => update({ captionStyle: preset.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {preset.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Custom AI Instructions */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>Custom AI Editor Instructions (Optional)</span>
          <span className="text-[11px] text-slate-400">E.g., "Prioritize controversial opinions and actionable checklists"</span>
        </label>
        <textarea
          rows={2}
          value={values.instructions}
          onChange={(e) => update({ instructions: e.target.value })}
          placeholder="Tell Gemini what to look for: 'Focus on founder regrets, numbers and metrics, keep hooks under 3 seconds...'"
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Video with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate {values.clipCount} Viral Clips Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
