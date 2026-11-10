import React from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';
import {
  Film,
  Scissors,
  Clock,
  Sparkles,
  TrendingUp,
  FolderOpen,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { projects, user, refreshProjects } = useApp();

  const totalClips = projects.reduce((acc, p) => acc + (p.clips?.length || 0), 0);
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const hoursSavedEstimate = Math.round(totalClips * 1.5 * 10) / 10;

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await StorageService.deleteProject(id);
      await refreshProjects();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Creator Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor your video pipeline, active credits, and AI viral clip generation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#/generate"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>New Video Project</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Projects</span>
            <Film className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {projects.length}
          </div>
          <div className="text-[11px] text-slate-400">
            {completedProjects} completed projects
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Clips Generated</span>
            <Scissors className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalClips}
          </div>
          <div className="text-[11px] text-slate-400">
            TikTok, Shorts & Reels
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Editing Hours Saved</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {hoursSavedEstimate}h
          </div>
          <div className="text-[11px] text-slate-400">
            ~1.5 hrs saved per clip
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Remaining Credits</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {user.creditsTotal - user.creditsUsed}
          </div>
          <div className="text-[11px] text-slate-400">
            Plan: {user.plan}
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Projects</h2>
            <p className="text-xs text-slate-500">Access and edit your video projects.</p>
          </div>
          <a
            href="#/projects"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((proj) => (
            <div
              key={proj.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                  <span className="text-indigo-500 font-semibold">{proj.clips?.length || 0} clips</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {proj.transcript?.slice(0, 110) || 'No transcript text available.'}...
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <a
                  href={`#/editor?projectId=${proj.id}`}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Open Studio</span>
                </a>

                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
