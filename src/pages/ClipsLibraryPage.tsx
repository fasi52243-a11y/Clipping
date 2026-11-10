import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClipCard } from '../components/clips/ClipCard';
import { ClipItem, PlatformType, ProjectItem } from '../types';
import { StorageService } from '../services/storageService';
import {
  Scissors,
  Search,
  Filter,
  Sparkles,
  ArrowUpDown,
  Smartphone,
  Plus,
  Trash2,
} from 'lucide-react';

export const ClipsLibraryPage: React.FC = () => {
  const { projects, refreshProjects } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'duration' | 'newest'>('score');

  // Flatten all clips from all projects into an array with project reference
  const allClipsWithProject = useMemo(() => {
    const list: { clip: ClipItem; project: ProjectItem }[] = [];
    projects.forEach((proj) => {
      proj.clips.forEach((clip) => {
        list.push({ clip, project: proj });
      });
    });
    return list;
  }, [projects]);

  // Filter and sort clips
  const filteredClips = useMemo(() => {
    return allClipsWithProject
      .filter(({ clip, project }) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = clip.title.toLowerCase().includes(q);
          const matchesHook = clip.hook.toLowerCase().includes(q);
          const matchesTopic = clip.mainTopic.toLowerCase().includes(q);
          const matchesProject = project.title.toLowerCase().includes(q);
          if (!matchesTitle && !matchesHook && !matchesTopic && !matchesProject) {
            return false;
          }
        }

        // Platform filter
        if (selectedPlatform !== 'All' && clip.recommendedPlatform !== selectedPlatform) {
          return false;
        }

        // Min score
        if (clip.aiScore < minScore) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.clip.aiScore - a.clip.aiScore;
        } else if (sortBy === 'duration') {
          return b.clip.duration - a.clip.duration;
        } else {
          return new Date(b.project.updatedAt).getTime() - new Date(a.project.updatedAt).getTime();
        }
      });
  }, [allClipsWithProject, searchQuery, selectedPlatform, minScore, sortBy]);

  const handleOpenEditor = (clipId: string, projectId: string) => {
    window.location.hash = `#/editor?projectId=${projectId}`;
  };

  const handleDeleteClip = async (clipId: string, project: ProjectItem) => {
    const updatedClips = project.clips.filter((c) => c.id !== clipId);
    await StorageService.saveProject({
      ...project,
      clips: updatedClips,
    });
    await refreshProjects();
  };

  const handleUpdateClip = async (updatedClip: ClipItem, project: ProjectItem) => {
    const updatedClips = project.clips.map((c) => (c.id === updatedClip.id ? updatedClip : c));
    await StorageService.saveProject({
      ...project,
      clips: updatedClips,
    });
    await refreshProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Clips Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, preview, edit and download your AI-generated short clips across all projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#/generate"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate New Clips</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hook, topic, or video title..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Platform filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Platforms</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="score">Sort by AI Score</option>
              <option value="duration">Sort by Duration</option>
              <option value="newest">Sort by Newest</option>
            </select>
          </div>

          {/* Min score selector */}
          <div className="sm:col-span-2">
            <select
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono"
            >
              <option value="0">All Scores</option>
              <option value="80">Score &ge; 80</option>
              <option value="90">Score &ge; 90 (Viral)</option>
              <option value="95">Score &ge; 95 (Elite)</option>
            </select>
          </div>
        </div>

        {/* Active stats counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Showing <strong className="text-slate-900 dark:text-white font-mono">{filteredClips.length}</strong> of <span className="font-mono">{allClipsWithProject.length}</span> clips</span>
          <span className="text-[11px]">Tip: Click "Open in Editor" to adjust timing, fonts, and background audio</span>
        </div>
      </div>

      {/* Clips Grid */}
      {filteredClips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClips.map(({ clip, project }) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              project={project}
              onOpenEditor={(cid) => handleOpenEditor(cid, project.id)}
              onDeleteClip={(cid) => handleDeleteClip(cid, project)}
              onUpdateClip={(uc) => handleUpdateClip(uc, project)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mx-auto">
            <Scissors className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No clips match your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your platform filters or generate new clips from your recordings.
          </p>
          <a
            href="#/generate"
            className="inline-block mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
          >
            Generate AI Clips
          </a>
        </div>
      )}
    </div>
  );
};
