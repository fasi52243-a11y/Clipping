import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandKit } from '../types';
import { StorageService } from '../services/storageService';
import { CAPTION_PRESETS } from '../data/captionPresets';
import {
  Wand2,
  Check,
  Plus,
  Trash2,
  Sliders,
  Type,
  ImageIcon,
} from 'lucide-react';

export const BrandTemplatesPage: React.FC = () => {
  const { brandKits, activeBrandKit, setActiveBrandKitId } = useApp();

  const [kits, setKits] = useState<BrandKit[]>(brandKits);
  const [selectedKit, setSelectedKit] = useState<BrandKit>(activeBrandKit);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleUpdateSelected = (patch: Partial<BrandKit>) => {
    setSelectedKit({ ...selectedKit, ...patch });
  };

  const handleSaveKit = async () => {
    await StorageService.saveBrandKit(selectedKit);
    const updated = await StorageService.getAllBrandKits();
    setKits(updated);
    setActiveBrandKitId(selectedKit.id);
    setSaveMessage('Brand Kit Saved!');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleCreateNew = () => {
    const newKit: BrandKit = {
      id: `brand-${Date.now()}`,
      name: 'New Custom Brand Kit',
      primaryColor: '#6366F1',
      secondaryColor: '#F59E0B',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      defaultCaptionPreset: 'bold-impact',
      watermarkPosition: 'top-right',
      watermarkOpacity: 0.85,
      introText: 'ClipForge Studio',
      outroText: 'Follow for more',
    };
    setSelectedKit(newKit);
    setKits([...kits, newKit]);
  };

  const handleDeleteKit = async (id: string) => {
    if (kits.length <= 1) {
      alert('You must keep at least one brand kit.');
      return;
    }
    await StorageService.deleteBrandKit(id);
    const updated = await StorageService.getAllBrandKits();
    setKits(updated);
    setSelectedKit(updated[0]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Brand Kits & Design Presets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Standardize fonts, logos, watermark placements, and color schemes across all generated clips.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Brand Kit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List of Brand Kits */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Saved Brand Kits</span>
          <div className="space-y-2">
            {kits.map((kit) => {
              const isSelected = selectedKit.id === kit.id;
              return (
                <div
                  key={kit.id}
                  onClick={() => {
                    setSelectedKit(kit);
                    setActiveBrandKitId(kit.id);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{kit.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: kit.primaryColor }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: kit.secondaryColor }}
                    />
                    <span className="font-mono">{kit.defaultCaptionPreset}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Editor Form for Active Kit */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit {selectedKit.name}
              </h3>
              <p className="text-xs text-slate-500">Changes apply automatically to studio projects using this kit.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteKit(selectedKit.id)}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg"
                title="Delete kit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSaveKit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                {saveMessage || 'Save Brand Kit'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Kit Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Brand Kit Name</label>
              <input
                type="text"
                value={selectedKit.name}
                onChange={(e) => handleUpdateSelected({ name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            {/* Colors */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedKit.primaryColor}
                  onChange={(e) => handleUpdateSelected({ primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-slate-800"
                />
                <span className="font-mono text-xs">{selectedKit.primaryColor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Secondary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedKit.secondaryColor}
                  onChange={(e) => handleUpdateSelected({ secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-slate-800"
                />
                <span className="font-mono text-xs">{selectedKit.secondaryColor}</span>
              </div>
            </div>

            {/* Default Caption Preset */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Default Subtitle Style</label>
              <select
                value={selectedKit.defaultCaptionPreset}
                onChange={(e) => handleUpdateSelected({ defaultCaptionPreset: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
              >
                {CAPTION_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Watermark Position */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Watermark Placement</label>
              <select
                value={selectedKit.watermarkPosition}
                onChange={(e) => handleUpdateSelected({ watermarkPosition: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="top-right">Top Right Corner</option>
                <option value="top-left">Top Left Corner</option>
                <option value="bottom-right">Bottom Right Corner</option>
                <option value="bottom-left">Bottom Left Corner</option>
              </select>
            </div>

            {/* Intro & Outro text */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Intro Title Header</label>
              <input
                type="text"
                value={selectedKit.introText || ''}
                onChange={(e) => handleUpdateSelected({ introText: e.target.value })}
                placeholder="E.g., ClipForge Studio Cut"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800 dark:text-slate-200">Outro CTA Line</label>
              <input
                type="text"
                value={selectedKit.outroText || ''}
                onChange={(e) => handleUpdateSelected({ outroText: e.target.value })}
                placeholder="E.g., Follow for daily insights"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
