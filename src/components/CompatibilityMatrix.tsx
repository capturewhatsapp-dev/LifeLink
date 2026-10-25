import React, { useState } from 'react';
import { BloodGroup } from '../types/index.ts';
import { BLOOD_COMPATIBILITY } from '../utils/compatibility.ts';
import { getBloodGroupStyle } from '../utils/bloodColor.ts';
import { Check, X, Info, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

interface CompatibilityMatrixProps {
  onSelectGroupForSearch?: (group: BloodGroup) => void;
  organizations?: any[];
}

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({
  onSelectGroupForSearch,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const selectedInfo = BLOOD_COMPATIBILITY[selectedGroup];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-rose-600 tracking-wider uppercase mb-1">
            Clinical Transfusion Rules
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Interactive Blood Compatibility Matrix
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Understand clinical matching between donors and recipients according to ABO blood group
            and Rh factor antigens.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
          <Info className="w-4 h-4 text-slate-600 shrink-0" />
          <span>Universal Donor: <strong>O-</strong> · Universal Recipient: <strong>AB+</strong></span>
        </div>
      </div>

      {/* Blood Group Selector Tabs */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
          Select Blood Group to Explore:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {ALL_BLOOD_GROUPS.map((bg) => {
            const isSelected = selectedGroup === bg;
            return (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`py-3 px-2 rounded-xl text-center font-bold text-lg transition-all border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-200'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300 hover:bg-rose-50/50'
                }`}
              >
                <div>{bg}</div>
                <div
                  className={`text-[10px] font-normal mt-0.5 ${
                    isSelected ? 'text-rose-100' : 'text-slate-500'
                  }`}
                >
                  {BLOOD_COMPATIBILITY[bg].isUniversalDonor
                    ? 'Universal'
                    : BLOOD_COMPATIBILITY[bg].isUniversalRecipient
                    ? 'Recipient'
                    : BLOOD_COMPATIBILITY[bg].populationPercentageIndia}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Card for Selected Group */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-2xl flex items-center justify-center">
              {selectedGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Blood Group {selectedGroup} Profile
                </h3>
                {selectedInfo.isUniversalDonor && (
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                    Universal RBC Donor
                  </span>
                )}
                {selectedInfo.isUniversalRecipient && (
                  <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                    Universal RBC Recipient
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Frequency in India: {selectedInfo.populationPercentageIndia} of voluntary donors
              </div>
            </div>
          </div>

          {onSelectGroupForSearch && (
            <button
              onClick={() => onSelectGroupForSearch(selectedGroup)}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>View Active Requests for {selectedGroup}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-sm text-slate-700 mt-3 leading-relaxed">
          {selectedInfo.rarityDescription}
        </p>

        {/* Compatibility Dual Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {/* Column A: Can Donate To */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Can Donate Red Blood Cells To:</span>
              </span>
              <span className="text-xs font-mono font-medium text-slate-500">
                {selectedInfo.canDonateTo.length} Blood Types
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {ALL_BLOOD_GROUPS.map((target) => {
                const canDonate = selectedInfo.canDonateTo.includes(target);
                return (
                  <div
                    key={target}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      canDonate
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="text-base">{target}</div>
                    <div className="text-[10px] flex items-center justify-center gap-0.5 mt-0.5">
                      {canDonate ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 inline" />
                          <span className="text-emerald-700">Compatible</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 text-slate-400 inline" />
                          <span className="text-slate-500">Ineligible</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B: Can Receive From */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 tracking-wide uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Can Safely Receive From:</span>
              </span>
              <span className="text-xs font-mono font-medium text-slate-500">
                {selectedInfo.canReceiveFrom.length} Blood Types
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {ALL_BLOOD_GROUPS.map((source) => {
                const canReceive = selectedInfo.canReceiveFrom.includes(source);
                return (
                  <div
                    key={source}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      canReceive
                        ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="text-base">{source}</div>
                    <div className="text-[10px] flex items-center justify-center gap-0.5 mt-0.5">
                      {canReceive ? (
                        <>
                          <Check className="w-3 h-3 text-sky-600 inline" />
                          <span className="text-sky-700">Compatible</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3 text-slate-400 inline" />
                          <span className="text-slate-500">Ineligible</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
