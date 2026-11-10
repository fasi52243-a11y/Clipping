import React, { useState, useRef, useEffect } from 'react';
import { Logo } from '../brand/Logo';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Scissors,
  Wand2,
  FileText,
  Volume2,
  Layers,
  HelpCircle,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  FolderOpen,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, user, logout } = useApp();
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [aiToolsMenuOpen, setAiToolsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const productRef = useRef<HTMLDivElement>(null);
  const aiToolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) {
        setProductMenuOpen(false);
      }
      if (aiToolsRef.current && !aiToolsRef.current.contains(e.target as Node)) {
        setAiToolsMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setProductMenuOpen(false);
    setAiToolsMenuOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a href="#/" onClick={closeAll} className="flex items-center shrink-0">
          <Logo size="md" />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-300">
          {/* Product Dropdown */}
          <div className="relative" ref={productRef}>
            <button
              onClick={() => {
                setProductMenuOpen(!productMenuOpen);
                setAiToolsMenuOpen(false);
              }}
              className="flex items-center gap-1 hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
            >
              <span>Product</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${productMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {productMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <a
                  href="#/generate"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">AI Clip Generator</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Auto-cut viral moments with Gemini</div>
                  </div>
                </a>

                <a
                  href="#/editor"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Scissors className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Multi-track Video Editor</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Full timeline, trim, split & music</div>
                  </div>
                </a>

                <a
                  href="#/features#reframing"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Smart Reframing</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Speaker tracking 16:9 to 9:16</div>
                  </div>
                </a>

                <a
                  href="#/templates"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Wand2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Brand Kits & Templates</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Apply fonts, colors & watermarks</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* AI Tools Dropdown */}
          <div className="relative" ref={aiToolsRef}>
            <button
              onClick={() => {
                setAiToolsMenuOpen(!aiToolsMenuOpen);
                setProductMenuOpen(false);
              }}
              className="flex items-center gap-1 hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
            >
              <span>AI Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aiToolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {aiToolsMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <a
                  href="#/features#hooks"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Viral Hook Detector</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Identify 3-second attention hooks</div>
                  </div>
                </a>

                <a
                  href="#/features#captions"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Dynamic Captions</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">16 animated viral presets</div>
                  </div>
                </a>

                <a
                  href="#/features#broll"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Layers className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">AI B-Roll Suggestor</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Dialogue-aware visual overlays</div>
                  </div>
                </a>

                <a
                  href="#/features#audio"
                  onClick={closeAll}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Smart Audio & Silence</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Silence removal & voiceover</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          <a href="#/features" onClick={closeAll} className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#/pricing" onClick={closeAll} className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Pricing
          </a>
          <a href="#/help" onClick={closeAll} className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Resources
          </a>
        </nav>

        {/* Zone 3: Actions & Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account / Login Button */}
          {user && user.id !== 'usr_guest' ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium text-slate-900 dark:text-white"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50">
                  <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                      {user.plan} · {user.creditsTotal - user.creditsUsed} credits left
                    </div>
                  </div>

                  <a
                    href="#/dashboard"
                    onClick={closeAll}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </a>

                  <a
                    href="#/projects"
                    onClick={closeAll}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>My Projects</span>
                  </a>

                  <a
                    href="#/library"
                    onClick={closeAll}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Clips Library</span>
                  </a>

                  <a
                    href="#/settings"
                    onClick={closeAll}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Account Settings</span>
                  </a>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      logout();
                      closeAll();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="#/login"
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
              >
                Log In
              </a>
              <a
                href="#/signup"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap"
              >
                Sign Up
              </a>
            </div>
          )}

          {/* Primary CTA Button */}
          <a
            href="#/generate"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-950 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Generate AI Clips
          </a>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <a
            href="#/generate"
            onClick={closeAll}
            className="block px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg text-center"
          >
            Generate AI Clips
          </a>
          <div className="space-y-1 text-sm font-medium text-slate-800 dark:text-slate-200">
            <a href="#/dashboard" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              Dashboard
            </a>
            <a href="#/projects" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              My Projects
            </a>
            <a href="#/library" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              Clips Library
            </a>
            <a href="#/editor" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              Video Editor
            </a>
            <a href="#/templates" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              Brand Templates
            </a>
            <a href="#/features" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              Features
            </a>
            <a href="#/pricing" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              Pricing Plans
            </a>
            <a href="#/help" onClick={closeAll} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
              Help Center & FAQs
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
