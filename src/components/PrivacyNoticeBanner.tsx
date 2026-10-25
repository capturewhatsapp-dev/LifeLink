import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, Lock, EyeOff, UserCheck } from 'lucide-react';

export const PrivacyNoticeBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 bg-rose-600/20 text-rose-400 rounded-lg shrink-0 border border-rose-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Donor Privacy & Sensitive Health Data Protection
              </h2>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-medium">
                Encrypted Vault Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Personal contact numbers, clinical histories, and residential addresses are never made publicly visible.
              Coordinations happen securely in-app with verified identity masking.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="self-start md:self-center px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>{expanded ? 'Hide Details' : 'Security Policy'}</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">Zero Public Exposure</div>
              <p className="text-slate-400 mt-0.5">
                Donors are identified by secure token pseudonyms (e.g., Donor #4089). Phone and email are never shown.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">Masked In-App Chat</div>
              <p className="text-slate-400 mt-0.5">
                Direct coordination between seekers and donors takes place via secure real-time messaging with medical safety filters.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">Hospital Cross-Matching</div>
              <p className="text-slate-400 mt-0.5">
                Official transfusion is verified directly on-site at certified hospital blood banks following National Blood Transfusion protocols.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
