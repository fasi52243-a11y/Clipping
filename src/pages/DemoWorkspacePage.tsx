import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, CreditCard, Shield, Plus, Check, Mail, ExternalLink } from 'lucide-react';

interface DemoPageProps {
  type: 'workspace' | 'billing' | 'admin';
}

export const DemoWorkspacePage: React.FC<DemoPageProps> = ({ type }) => {
  const { user } = useApp();

  // Team workspace mock state
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Alex Rivera (You)', email: user.email, role: 'Owner', status: 'Active' },
    { id: '2', name: 'Elena Vance', email: 'elena@production.com', role: 'Editor', status: 'Active' },
    { id: '3', name: 'Marcus Cole', email: 'marcus@salesgrowth.io', role: 'Viewer', status: 'Pending' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setTeamMembers([
      ...teamMembers,
      {
        id: `${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: 'Editor',
        status: 'Invited',
      },
    ]);
    setInviteEmail('');
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 2500);
  };

  const titles = {
    workspace: 'Team Workspace & Collaboration',
    billing: 'Billing, Invoices & Credits',
    admin: 'Organization Admin Console',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Demo Mode Notice Banner */}
      <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-4">
        <div>
          <strong className="font-bold">Simulated Feature (Demo / Coming Soon):</strong> This interface is a functional preview designed for team collaboration and multi-seat billing. All interactions are backed by local demo state.
        </div>
        <span className="font-mono text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded font-bold uppercase shrink-0">
          Demo Mock
        </span>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {titles[type]}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {type === 'workspace' && 'Manage team members, shared clip review queues, and seat permissions.'}
          {type === 'billing' && 'View your active plan, invoice history, payment methods, and usage metering.'}
          {type === 'admin' && 'Enterprise access control, audit logs, and custom prompt templates.'}
        </p>
      </div>

      {type === 'workspace' && (
        <div className="space-y-6">
          {/* Invite team member */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Invite Collaborator</h3>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="colleague@yourcompany.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
              >
                Send Invite
              </button>
            </form>
            {inviteSent && (
              <span className="text-xs text-emerald-500 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Invitation link generated & added to team roster</span>
              </span>
            )}
          </div>

          {/* Members Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {teamMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{m.name}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">{m.email}</td>
                    <td className="p-4">{m.role}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-semibold font-mono text-emerald-500">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {type === 'billing' && (
        <div className="space-y-6 text-xs">
          {/* Active Plan Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px]">Current Subscription</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.plan}</h3>
              </div>
              <span className="font-mono text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">
                Active &middot; Auto-renews
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 block text-[10px]">MONTHLY CREDITS</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  {user.creditsTotal} Credits
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CREDITS USED</span>
                <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {user.creditsUsed} Credits
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NEXT BILLING DATE</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  Dec 1, 2026
                </span>
              </div>
            </div>
          </div>

          {/* Invoices list */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Invoice History (Simulated)</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { date: 'Nov 01, 2026', id: 'INV-2026-11', amount: '$39.00', status: 'Paid' },
                { date: 'Oct 01, 2026', id: 'INV-2026-10', amount: '$39.00', status: 'Paid' },
                { date: 'Sep 01, 2026', id: 'INV-2026-09', amount: '$39.00', status: 'Paid' },
              ].map((inv) => (
                <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">{inv.id}</span>
                    <span className="text-slate-400 text-[11px] ml-3">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{inv.amount}</span>
                    <span className="text-[10px] text-emerald-500 font-bold">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'admin' && (
        <div className="space-y-6 text-xs">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Organization Security Policy</h3>
            <p className="text-slate-500 leading-relaxed">
              Enforce single sign-on (SSO), domain-restricted clip sharing, and automated data retention policies.
            </p>
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500 rounded" />
                <span>Require 2FA for all team editors</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500 rounded" />
                <span>Auto-archive project videos after 90 days</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
