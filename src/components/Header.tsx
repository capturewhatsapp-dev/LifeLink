import React from 'react';
import { Droplet, HeartHandshake, ShieldAlert, Building2, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'requests' | 'donors' | 'organizations' | 'campaigns' | 'privacy';
  setActiveTab: (tab: 'requests' | 'donors' | 'organizations' | 'campaigns' | 'privacy') => void;
  onRequestBlood: () => void;
  onRegisterDonor: () => void;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRequestBlood,
  onRegisterDonor,
  urgentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('requests')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
            <Droplet className="w-4 h-4 fill-current stroke-white stroke-2" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              LifeLink
            </span>
          </div>
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'text-rose-700 bg-rose-50 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Urgent Needs</span>
            {urgentCount > 0 && (
              <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-1.5 py-0.2 rounded-full tabular-nums">
                {urgentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('donors')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'donors'
                ? 'text-rose-700 bg-rose-50 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Find Donors</span>
          </button>

          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'organizations'
                ? 'text-rose-700 bg-rose-50 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Partner Blood Banks</span>
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'campaigns'
                ? 'text-rose-700 bg-rose-50 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Awareness Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'text-rose-700 bg-rose-50 font-semibold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Policies</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRegisterDonor}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            Register as Donor
          </button>
          <button
            onClick={onRequestBlood}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <Droplet className="w-3.5 h-3.5 fill-current" />
            <span>Request Blood</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-200 px-3 py-2 flex items-center gap-1 overflow-x-auto text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap ${
            activeTab === 'requests' ? 'bg-rose-100 text-rose-800 font-semibold' : 'text-slate-600'
          }`}
        >
          Urgent ({urgentCount})
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap ${
            activeTab === 'donors' ? 'bg-rose-100 text-rose-800 font-semibold' : 'text-slate-600'
          }`}
        >
          Find Donors
        </button>
        <button
          onClick={() => setActiveTab('organizations')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap ${
            activeTab === 'organizations' ? 'bg-rose-100 text-rose-800 font-semibold' : 'text-slate-600'
          }`}
        >
          Partners
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap ${
            activeTab === 'campaigns' ? 'bg-rose-100 text-rose-800 font-semibold' : 'text-slate-600'
          }`}
        >
          Awareness
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap ${
            activeTab === 'privacy' ? 'bg-rose-100 text-rose-800 font-semibold' : 'text-slate-600'
          }`}
        >
          Policies
        </button>
      </div>
    </header>
  );
};
