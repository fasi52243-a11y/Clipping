import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/brand/Logo';
import { Lock, Mail, User, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const { loginAsDemo } = useApp();
  const [email, setEmail] = useState('alex@creatorstudio.io');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Rivera');
  const [submittedReset, setSubmittedReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setSubmittedReset(true);
      return;
    }
    // Perform demo login
    loginAsDemo();
    window.location.hash = '#/dashboard';
  };

  const titles = {
    login: 'Sign in to ClipForge AI',
    signup: 'Create your Creator Account',
    forgot: 'Reset your Password',
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <a href="#/" className="inline-block">
            <Logo size="lg" />
          </a>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {titles[mode]}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' && 'Enter your credentials or use 1-click demo login below.'}
            {mode === 'signup' && 'Get 30 free video minutes and test viral AI short cuts.'}
            {mode === 'forgot' && "Enter your email address and we'll send a recovery link."}
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Local Demo Auth &middot; Ready for Supabase</span>
          </span>
          <span className="text-[10px] font-mono bg-indigo-200 dark:bg-indigo-900 px-1.5 py-0.5 rounded">
            Demo Mode
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          {mode === 'forgot' && submittedReset ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recovery Link Sent</h3>
              <p className="text-xs text-slate-500">
                A password reset instructions email was dispatched to <strong>{email}</strong>.
              </p>
              <a
                href="#/login"
                className="inline-block mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Back to Sign In
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    {mode === 'login' && (
                      <a href="#/forgot-password" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Free Account' : 'Send Reset Link'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Login Preset Buttons */}
          {mode !== 'forgot' && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Instant Demo Profiles (1-Click)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemo('Creator');
                    window.location.hash = '#/dashboard';
                  }}
                  className="flex-1 py-1.5 px-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  Solo Creator
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemo('Agency Admin');
                    window.location.hash = '#/dashboard';
                  }}
                  className="flex-1 py-1.5 px-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  Agency Admin
                </button>
              </div>
            </div>
          )}

          {/* Bottom Switch Links */}
          <div className="text-center text-xs text-slate-500 pt-2">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <a href="#/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Sign up free
                </a>
              </span>
            ) : mode === 'signup' ? (
              <span>
                Already have an account?{' '}
                <a href="#/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Sign in
                </a>
              </span>
            ) : (
              <a href="#/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Back to Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
