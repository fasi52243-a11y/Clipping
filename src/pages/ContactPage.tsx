import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feedback & Feature Requests');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          Direct Creator Support
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Get in Touch with ClipForge
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Have an inquiry, custom video format requirement, or partnership idea? Send us a note.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Message Delivered</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Thank you, {name}! We've logged your request regarding "{topic}" and will follow up at {email} within 24 hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setMessage('');
            }}
            className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm text-xs"
        >
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Vance"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@studio.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="Feedback & Feature Requests">Feedback & Feature Requests</option>
              <option value="Video Codec & Export Question">Video Codec & Export Question</option>
              <option value="Agency & Bulk Pricing">Agency & Bulk Pricing</option>
              <option value="Bug Report">Bug Report</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help your content workflow?"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
};
