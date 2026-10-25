import React, { useState } from 'react';
import { VerifiedOrganization, BloodGroup } from '../types/index.ts';
import {
  Building2,
  CheckCircle2,
  Phone,
  Clock,
  ShieldCheck,
  Search,
  MapPin,
  Mail,
} from 'lucide-react';

interface VerifiedOrganizationsViewProps {
  organizations: VerifiedOrganization[];
}

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const VerifiedOrganizationsView: React.FC<VerifiedOrganizationsViewProps> = ({
  organizations,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const cities = ['ALL', ...Array.from(new Set(organizations.map((o) => o.city)))];
  const types = ['ALL', ...Array.from(new Set(organizations.map((o) => o.type)))];

  const filtered = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'ALL' || org.city === selectedCity;
    const matchesType = selectedType === 'ALL' || org.type === selectedType;
    return matchesSearch && matchesCity && matchesType;
  });

  const getOrgTypeStyle = (type: string) => {
    switch (type) {
      case 'Government Hospital':
        return {
          badge: 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-2 py-0.5 rounded-md',
          icon: 'bg-blue-50 text-blue-700 border border-blue-200',
        };
      case 'Multispecialty Hospital':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold px-2 py-0.5 rounded-md',
          icon: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        };
      case 'Diagnostic & Blood Centre':
        return {
          badge: 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold px-2 py-0.5 rounded-md',
          icon: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
        };
      case 'Pharmacy & Blood Desk':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2 py-0.5 rounded-md',
          icon: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        };
      case 'Blood Bank':
      default:
        return {
          badge: 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold px-2 py-0.5 rounded-md',
          icon: 'bg-sky-50 text-sky-800 border border-sky-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AIIMS Delhi, Apollo, Redcliffe, Dr. Lal PathLabs, city, or address..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Cities' : c}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Partner Categories' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Tags for Featured Facilities */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-600 no-scrollbar pt-1">
          <span className="font-semibold text-slate-500 uppercase tracking-wide text-[11px] shrink-0">
            Featured Partners:
          </span>
          <button
            onClick={() => setSearchQuery('Redcliffe')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md shrink-0 font-medium"
          >
            Redcliffe Labs
          </button>
          <button
            onClick={() => setSearchQuery('Apollo')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md shrink-0 font-medium"
          >
            Apollo Hospitals & Apheresis
          </button>
          <button
            onClick={() => setSearchQuery('Dr. Lal')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md shrink-0 font-medium"
          >
            Dr. Lal PathLabs
          </button>
          <button
            onClick={() => setSearchQuery('Apollo Pharmacy')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md shrink-0 font-medium"
          >
            Apollo Pharmacy
          </button>
          <button
            onClick={() => setSearchQuery('AIIMS Delhi')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md shrink-0 font-medium"
          >
            AIIMS Delhi
          </button>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-rose-600 font-semibold px-2 py-1 underline shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Organizations Grid (5 Verified Partner Facilities) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((org) => {
          const typeStyle = getOrgTypeStyle(org.type);
          return (
            <div
              key={org.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${typeStyle.icon}`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {org.name}
                        </h3>
                        {org.verifiedBadge && (
                          <span title="Verified License" className="inline-flex">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span className={typeStyle.badge}>
                          {org.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {org.operates24x7 && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      24/7 Hotline
                    </span>
                  )}
                </div>

              {/* Address & Emergency Hotline */}
              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{org.address}</p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 pt-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold font-mono text-slate-900">{org.emergencyContact}</span>
                  <span className="text-slate-400 text-[11px]">(Transfusion Emergency Desk)</span>
                </div>
              </div>

              {/* Blood Unit Stock Levels with 3 Color Tiers */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <div className="flex items-center justify-between flex-wrap gap-1 text-xs font-semibold text-slate-700 mb-2">
                  <span>Tested Units in Hospital Storage:</span>
                  <span className="text-[11px] font-mono font-normal text-slate-400">
                    Audit: {org.lastStockAudit}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {BLOOD_GROUPS.map((bg) => {
                    const units = org.currentStock[bg] || 0;
                    let colorClass = '';
                    if (units > 10) {
                      colorClass = 'bg-emerald-100/90 border-emerald-300 text-emerald-950 font-bold';
                    } else if (units >= 5) {
                      colorClass = 'bg-sky-100/90 border-sky-300 text-sky-950 font-bold';
                    } else {
                      colorClass = 'bg-rose-100/90 border-rose-300 text-rose-950 font-bold';
                    }

                    return (
                      <div
                        key={bg}
                        className={`p-1.5 rounded-lg border text-center transition-all ${colorClass}`}
                      >
                        <div className="text-xs">{bg}</div>
                        <div className="text-[11px] font-mono tabular-nums mt-0.5">
                          {units} <span className="text-[9px] font-normal opacity-70">u</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Direct Call Button */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${org.emergencyContact.replace(/\s+/g, '')}`}
                className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Center Desk ({org.emergencyContact})</span>
              </a>
            </div>
          </div>
        );
      })}
      </div>

      {/* Hospital & Diagnostic Center Onboarding Invitation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Network Expansion & Partnerships
            </div>
            <p className="text-sm font-medium text-slate-100">
              If any hospital and Diagnostic &amp; Blood Centre wish to join, contact us:{' '}
              <a
                href="mailto:lifelinkofficial@gmail.com"
                className="font-bold text-amber-300 hover:text-white underline transition-colors"
              >
                lifelinkofficial@gmail.com
              </a>
            </p>
          </div>
        </div>

        <a
          href="mailto:lifelinkofficial@gmail.com"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Mail className="w-4 h-4" />
          <span>Email lifelinkofficial@gmail.com</span>
        </a>
      </div>
    </div>
  );
};
