import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-700 dark:text-slate-300">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Effective date: November 2026 &middot; ClipForge AI
        </p>
      </div>

      {type === 'privacy' ? (
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Process</h2>
            <p>
              ClipForge AI operates as a client-assisted web application. When you upload or provide a video for processing,
              audio transcription requests are sent directly to the server-side Gemini 3.8 Flash API endpoint for
              topic analysis, speaker segmentation, and clip selection. Video files are rendered locally in your browser.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Local Storage & Client Persistence</h2>
            <p>
              Your video projects, custom brand kits, and timeline adjustments are saved inside your device's
              browser storage (IndexedDB and localStorage). We do not store your private video files on remote permanent servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Third-Party AI Models</h2>
            <p>
              Text and speech analysis utilizes Google Gemini models through Google AI Studio API services.
              Dialogue transcripts submitted for clip extraction are handled in accordance with Google's API data governance policies.
            </p>
          </section>
        </div>
      ) : (
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Service Usage & Licensing</h2>
            <p>
              ClipForge AI provides tools to assist creators in cutting, editing, and captioning video content.
              You retain all ownership, intellectual property rights, and commercial licensing to your original recordings
              and exported clips.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. AI Virality Estimates Disclaimer</h2>
            <p>
              The "AI Score" and viral potential ratings displayed within ClipForge AI represent structural estimates
              computed by analyzing hook strength, timing density, and dialogue clarity. These scores do not guarantee
              actual viewership, algorithmic distribution, or engagement on third-party platforms (such as TikTok, YouTube, or Instagram).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Platform Compliance</h2>
            <p>
              Users are solely responsible for ensuring that content uploaded and published conforms to the community guidelines
              and copyright regulations of the target distribution platforms.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};
