import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';
import {
  User,
  Shield,
  Moon,
  Sun,
  HardDrive,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const AccountSettingsPage: React.FC = () => {
  const { user, theme, toggleTheme, refreshProjects, serverStatus } = useApp();
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveProfile = () => {
    const updated = { ...user, name: profileName, email: profileEmail };
    StorageService.saveUserProfile(updated);
    setSaveMessage('Profile settings updated');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleResetSampleData = async () => {
    if (confirm('Reset your database to the 3 initial sample video projects?')) {
      // Clear indexedDB and reload
      indexedDB.deleteDatabase('ClipForgeDB');
      await refreshProjects();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Account & Engine Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your creator profile, theme preferences, and local storage database.
        </p>
      </div>

      <div className="space-y-6 text-xs">
        {/* Profile Settings */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>User Profile</span>
            </h3>
            <span className="font-mono text-[10px] text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
              {user.isDemoUser ? 'Local Demo Session' : 'Active Account'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Role: <strong className="text-slate-700 dark:text-slate-300">{user.role}</strong> &middot; Plan: <strong className="text-slate-700 dark:text-slate-300">{user.plan}</strong>
            </span>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-xs"
            >
              {saveMessage || 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Server & Gemini AI Health Check */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Gemini 3.8 Flash Connectivity</span>
            </h3>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{serverStatus.status === 'ok' ? 'Online' : 'Checking'}</span>
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            All AI video intelligence tasks (transcription, hook detection, speech analysis) run through
            the server-side `@google/genai` proxy using Google's modern <strong>gemini-3.8-flash</strong> model.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1">
            <div className="text-slate-500">API Gateway: <span className="text-slate-800 dark:text-slate-200">/api/gemini/analyze-video</span></div>
            <div className="text-slate-500">Target Model: <span className="text-slate-800 dark:text-slate-200">gemini-3.8-flash</span></div>
            <div className="text-slate-500">Environment Key: <span className="text-emerald-500">{serverStatus.hasGeminiKey ? 'Injected via AI Studio Secrets' : 'Standard Mock Fallback'}</span></div>
          </div>
        </div>

        {/* Local Storage & Cache */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <span>Browser Storage (IndexedDB)</span>
            </h3>
            <span className="font-mono text-[10px] text-slate-400">Offline-Persistent</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            All project timelines, clip cuts, custom brand kits, and video metadata are stored inside
            your browser's local IndexedDB so they survive page refreshes and browser restarts.
          </p>

          <div className="pt-2">
            <button
              onClick={handleResetSampleData}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database to Starter Samples</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
