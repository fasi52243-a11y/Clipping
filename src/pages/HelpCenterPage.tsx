import React, { useState } from 'react';
import { Search, HelpCircle, BookOpen, MessageSquare, ArrowRight, Video, Shield, Sparkles } from 'lucide-react';

export const HelpCenterPage: React.FC = () => {
  const [query, setQuery] = useState('');

  const articles = [
    {
      category: 'Getting Started',
      title: 'How to generate your first AI short clips in 60 seconds',
      snippet: 'Upload any MP4 or select one of our studio presets to start the Gemini analysis pipeline.',
    },
    {
      category: 'Smart Reframing',
      title: 'Centering multi-speaker interviews from 16:9 to 9:16',
      snippet: 'Learn how our face detection tracks movement and how to manually tweak horizontal pan offsets.',
    },
    {
      category: 'Captions & Typography',
      title: 'Customizing word highlight colors and karaoke bounce animations',
      snippet: 'Explore our 16 presets and learn how to adjust vertical position and font sizes in the studio.',
    },
    {
      category: 'Video Export',
      title: 'Supported browser export codecs and resolution specs',
      snippet: 'ClipForge AI renders clips directly in your browser using canvas video encoding and MediaRecorder.',
    },
    {
      category: 'Account & Quotas',
      title: 'Understanding AI credits and video duration limits',
      snippet: 'How credit deductions work and how to reset your monthly allowance in the dashboard.',
    },
  ];

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.snippet.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Search Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          ClipForge Knowledge Base
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          How can we help you create?
        </h1>

        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, video specs, or caption tutorials..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs shadow-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-md transition-all space-y-2 cursor-pointer group"
          >
            <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              {item.category}
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.snippet}
            </p>
          </div>
        ))}
      </div>

      {/* Still need help CTA */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Need personal assistance?</h4>
          <p className="text-xs text-slate-500">Our creator support team is available Monday through Friday.</p>
        </div>
        <a
          href="#/contact"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};
