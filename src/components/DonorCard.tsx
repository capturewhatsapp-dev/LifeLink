import React from 'react';
import { DonorProfile } from '../types/index.ts';
import {
  MapPin,
  CheckCircle,
  Phone,
  Navigation,
  Award,
} from 'lucide-react';
import { getBloodGroupStyle } from '../utils/bloodColor.ts';

interface DonorCardProps {
  donor: DonorProfile;
  onRequestLocation: (donor: DonorProfile) => void;
  onOpenChat?: (donor: DonorProfile) => void;
  onToggleAvailability?: (donorId: string, currentStatus: DonorProfile['availability']) => void;
  isCurrentUser?: boolean;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  onRequestLocation,
  onOpenChat,
  onToggleAvailability,
  isCurrentUser = false,
}) => {
  const handleCall = () => {
    window.location.href = `tel:${donor.phone.replace(/\s+/g, '')}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
            {donor.availability === 'AVAILABLE' ? 'Available Immediately' : 'On Standby'}
          </span>

          {donor.verifiedBadge && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
              <CheckCircle className="w-3 h-3 text-sky-600" />
              Verified
            </span>
          )}
        </div>

        {/* Identity & Blood Group with DISTINCT COLOR */}
        <div className="flex items-start gap-3.5 mt-1">
          <div
            className={`w-13 h-13 rounded-xl ${getBloodGroupStyle(donor.bloodGroup).bg} font-extrabold text-2xl flex flex-col items-center justify-center shrink-0 shadow-xs border ${getBloodGroupStyle(donor.bloodGroup).border}`}
          >
            <span>{donor.bloodGroup}</span>
            <span className="text-[9px] font-semibold tracking-wide opacity-90 uppercase">
              Blood
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {donor.fullName || donor.maskedIdentifier}
              </h3>
              {isCurrentUser && (
                <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-semibold shrink-0">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span className="font-mono text-[11px] font-semibold text-slate-400">
                {donor.maskedIdentifier}
              </span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{donor.donationsCount} Donations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Travel Details */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-800">
              {donor.locality}, {donor.city}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Willing to travel:</span>
            <span className="font-semibold text-slate-800 tabular-nums">
              Up to {donor.travelRadiusKm} km
            </span>
          </div>

          {/* Direct Contact Phone Box */}
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs mt-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wide">
                Donor Contact Number:
              </div>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                {donor.phone}
              </div>
            </div>
            <button
              onClick={handleCall}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>Call Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        {isCurrentUser && onToggleAvailability ? (
          <button
            onClick={() =>
              onToggleAvailability(
                donor.id,
                donor.availability === 'AVAILABLE' ? 'ON_CALL' : 'AVAILABLE'
              )
            }
            className="w-full py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
          >
            Toggle Status ({donor.availability === 'AVAILABLE' ? 'Set to Standby' : 'Set to Available'})
          </button>
        ) : (
          <button
            onClick={() => onRequestLocation(donor)}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Request to Hospital Location</span>
          </button>
        )}
      </div>
    </div>
  );
};
