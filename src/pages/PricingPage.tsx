import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Starter',
      audience: 'For solo creators & podcasters',
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        '60 minutes of video processing / month',
        'Auto transcription with Gemini 3.8 Flash',
        'Smart 9:16 vertical reframing',
        '8 caption style presets',
        '720p / 1080p export resolution',
        'Community support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Pro Creator',
      audience: 'For active creators & growing brands',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        '300 minutes of video processing / month',
        'All 16 viral caption presets & karaoke',
        'Multi-track timeline editor (trim, split, beats)',
        'Smart ducking & silence detection',
        'Custom brand watermark & kits',
        'Priority AI analysis queue',
        'Email & chat support',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Agency Studio',
      audience: 'For production agencies & marketing teams',
      monthlyPrice: 129,
      annualPrice: 99,
      features: [
        '1,200 minutes of video processing / month',
        'Unlimited brand kits & custom fonts',
        'Team workspace & shared project library',
        '4K & 60 FPS ultra high-res export',
        'Custom Gemini instructions & prompt tuning',
        'Dedicated account manager & SLA',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          Transparent Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white [text-wrap:balance]">
          Simple Plans for Every Content Creator
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Scale your short-form reach without spending thousands on manual agency editing.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-xl ring-2 ring-indigo-600 dark:ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.audience}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    What's included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#/generate"
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center block transition-colors ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note about Demo UI */}
      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs text-center max-w-xl mx-auto">
        <strong>Demo Note:</strong> Real payments are disabled in this evaluation preview. All plans and features can be explored freely using local session data.
      </div>
    </div>
  );
};
