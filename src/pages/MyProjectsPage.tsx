import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/storageService';
import {
  FolderOpen,
  Search,
  Scissors,
  Trash2,
  Sparkles,
  ExternalLink,
  Film,
  Plus,
} from 'lucide-react';

export const MyProjectsPage: React.FC = () => {
  const { projects, refreshProjects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project and all its clips?')) {
      await StorageService.deleteProject(id);
      await refreshProjects();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Video Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            All stored long-form video projects, clips, and timeline drafts.
          </p>
        </div>

        <a
          href="#/generate"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </a>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects by title..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-500 font-semibold">{proj.clips?.length || 0} clips</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {proj.title}
                </h3>

                <div className="text-[11px] text-slate-500 space-y-1 font-mono">
                  <div>Source: {proj.videoMeta.isSample ? 'Studio Sample' : proj.videoMeta.fileName}</div>
                  <div>Duration: {Math.round(proj.videoMeta.duration)}s &middot; Res: {proj.videoMeta.width}x{proj.videoMeta.height}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <a
                  href={`#/editor?projectId=${proj.id}`}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Open Video Studio</span>
                </a>

                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your first video to extract AI viral shorts.
          </p>
          <a
            href="#/generate"
            className="inline-block mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
          >
            Create New Project
          </a>
        </div>
      )}
    </div>
  );
};
