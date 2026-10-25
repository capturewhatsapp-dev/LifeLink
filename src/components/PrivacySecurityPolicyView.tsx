import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Headphones,
  Clock,
  Shield,
  LifeBuoy,
  Building2,
} from 'lucide-react';

export const PrivacySecurityPolicyView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-rose-600 tracking-wider uppercase mb-1">
          Compliance & Safety Framework
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Donor Privacy, Sensitive Health Data & Security Policies
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Comprehensive standards governed by National Blood Transfusion Council (NBTC) regulations
          and secure medical data communication protocols.
        </p>
      </div>

      {/* Official LifeLink Personal Care Toll Free Contact Card */}
      <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-rose-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 text-xs font-semibold border border-rose-400/30">
              <Headphones className="w-3.5 h-3.5" />
              <span>Official Support & Grievance Helpline</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              LifeLink Personal Care Toll Free Helpline
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Available 24x7 across India for patient emergency escalation, donor inquiries, data privacy verification, and grievance redressal under NBTC ethical guidelines.
            </p>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-xs text-rose-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-300" /> 24x7 Round-the-Clock Support
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-300" /> 100% Free & Toll-Free
              </span>
              <span className="flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 text-sky-300" /> Patient Care Coordinator Desk
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-center md:text-right">
              <div className="text-[11px] font-medium text-rose-200 uppercase tracking-wider">
                Personal Care Toll-Free
              </div>
              <a
                href="tel:1800108108"
                className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-300 hover:text-white transition-colors block mt-0.5"
              >
                1800 108 108
              </a>
              <div className="text-[10px] text-rose-200/80 mt-0.5">
                Toll Free • No Charges Apply
              </div>
            </div>

            <a
              href="tel:1800108108"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4 fill-current" />
              <span>Call 1800 108 108</span>
            </a>
          </div>
        </div>

        {/* Quick Scope of Toll-Free Assistance */}
        <div className="mt-5 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-rose-100/90">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="font-semibold text-white mb-0.5">Emergency Patient Assistance</div>
            <p className="text-[11px] text-rose-200">
              Immediate coordination if hospital request requires critical cross-matching or rare blood group search.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="font-semibold text-white mb-0.5">Donor Care & Availability</div>
            <p className="text-[11px] text-rose-200">
              Assistance for donors to update standby status, travel instructions to hospitals, or donation interval questions.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="font-semibold text-white mb-0.5">Privacy & Grievance Desk</div>
            <p className="text-[11px] text-rose-200">
              Instant profile de-listing, reporting paid-donation demands (strictly banned), or masking preference changes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Encrypted Health Vault Active</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clinical histories, confidential medical checklists, and residential addresses are securely
            vaulted. Only essential operational data (Blood Group, City, and availability status) are indexed
            to enable emergency matching.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Pseudonym & Token Masking</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full names and personal identity documents are shielded by default. Donors are represented
            by verified volunteer tokens (e.g. <em>Donor #4089</em>) so clinical assistance can proceed
            without public exposure.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Direct Contact & Hospital Arrival</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Seekers can directly call verified donors or dispatch a structured hospital arrival request
            with exact destination department, room, and patient code, minimizing emergency delay.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Non-Remuneration Legal Compliance</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Under the National Blood Policy, sale or purchase of blood is strictly illegal. All blood
            coordination on LifeLink is strictly voluntary and altruistic. Never exchange money or gifts.
          </p>
        </div>
      </div>

      {/* Official Checklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-rose-600" />
          <span>Operational Verification Protocol</span>
        </h3>

        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">On-Site Hospital Cross-Matching:</span> No blood is transfused without clinical ABO/Rh re-confirmation and infectious screening at authorized hospital blood banks.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Cold-Chain Storage Enforcement:</span> Only blood stored in calibrated +2°C to +6°C monitored medical refrigerators by verified centers is certified.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Donor Right to Opt Out:</span> Donors can toggle their status to On Standby, In Cooldown, or pause emergency callouts at any time by contacting our toll-free support at 1800 108 108 or in-app.
            </div>
          </div>
        </div>
      </div>

      {/* Verified Healthcare Network: Partner Blood Banks & Hospitals Policy */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
              Verified Healthcare Network
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Partner Blood Banks & Hospitals Directory Policy
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Call certified partners directly (AIIMS Delhi, Apollo Hospitals, Redcliffe Labs, Dr. Lal PathLabs, Apollo Pharmacy) for immediate blood units and emergency stock availability. All networked blood banks adhere to strict cold-chain maintenance (+2°C to +6°C), NACO guidelines, and mandatory multi-pathogen screening before clinical issue.
        </p>
      </div>
    </div>
  );
};

