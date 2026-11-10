import React from 'react';
import { Logo } from '../brand/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Logo size="md" />
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed text-xs">
              ClipForge AI transforms long-form podcasts, interviews, and keynotes into engaging,
              viral short clips with Gemini AI transcription, dynamic captions, and smart reframing.
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2">
              Note: AI scores represent estimated structural virality indexes based on hook timing and content density,
              not an algorithmic guarantee of social media reach.
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-2.5">
            <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs">Product</div>
            <ul className="space-y-2">
              <li><a href="#/generate" className="hover:text-slate-950 dark:hover:text-white transition-colors">AI Clip Generator</a></li>
              <li><a href="#/editor" className="hover:text-slate-950 dark:hover:text-white transition-colors">Video Studio Editor</a></li>
              <li><a href="#/library" className="hover:text-slate-950 dark:hover:text-white transition-colors">Clips Library</a></li>
              <li><a href="#/templates" className="hover:text-slate-950 dark:hover:text-white transition-colors">Brand Kits & Presets</a></li>
              <li><a href="#/features" className="hover:text-slate-950 dark:hover:text-white transition-colors">Smart Reframing</a></li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="space-y-2.5">
            <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs">Resources</div>
            <ul className="space-y-2">
              <li><a href="#/help" className="hover:text-slate-950 dark:hover:text-white transition-colors">Help Center & FAQ</a></li>
              <li><a href="#/contact" className="hover:text-slate-950 dark:hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#/pricing" className="hover:text-slate-950 dark:hover:text-white transition-colors">Pricing & Plans</a></li>
              <li><a href="#/workspace" className="hover:text-slate-950 dark:hover:text-white transition-colors">Team Workspace (Demo)</a></li>
              <li><a href="#/billing" className="hover:text-slate-950 dark:hover:text-white transition-colors">Billing & Invoices (Demo)</a></li>
            </ul>
          </div>

          {/* Legal & Account */}
          <div className="space-y-2.5">
            <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs">Legal & Trust</div>
            <ul className="space-y-2">
              <li><a href="#/privacy" className="hover:text-slate-950 dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#/terms" className="hover:text-slate-950 dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#/settings" className="hover:text-slate-950 dark:hover:text-white transition-colors">Account Settings</a></li>
              <li><a href="#/admin" className="hover:text-slate-950 dark:hover:text-white transition-colors">Admin Console (Demo)</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} ClipForge AI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">&middot;</span>
            <span>Local Browser Processing</span>
            <span aria-hidden="true">&middot;</span>
            <a href="#/privacy" className="hover:underline">Privacy</a>
            <span aria-hidden="true">&middot;</span>
            <a href="#/terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
