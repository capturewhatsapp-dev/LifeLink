import React from 'react';
import { BloodRequest } from '../types/index.ts';
import {
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Share2,
  Users,
  Droplet,
} from 'lucide-react';
import { getUnitsBadgeClass } from '../utils/bloodColor.ts';

interface RequestCardProps {
  request: BloodRequest;
  onOpenChat?: (request: BloodRequest) => void;
  onPledge: (request: BloodRequest) => void;
  userPledged?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onOpenChat,
  onPledge,
  userPledged = false,
}) => {
  const getUrgencyBloodBadgeStyle = (urgency: BloodRequest['urgency']) => {
    switch (urgency) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-600 text-white border-rose-700 shadow-sm',
          tag: 'text-rose-700 bg-rose-50 border-rose-200',
          label: 'Critical Need (within 2h)',
          iconColor: 'text-rose-600',
        };
      case 'HIGH':
        return {
          bg: 'bg-blue-600 text-white border-blue-700 shadow-sm',
          tag: 'text-blue-700 bg-blue-50 border-blue-200',
          label: 'Need in 6 hr',
          iconColor: 'text-blue-600',
        };
      case 'MODERATE':
        return {
          bg: 'bg-emerald-600 text-white border-emerald-700 shadow-sm',
          tag: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          label: 'Need in 24 hr',
          iconColor: 'text-emerald-600',
        };
      default:
        return {
          bg: 'bg-slate-700 text-white border-slate-800 shadow-sm',
          tag: 'text-slate-700 bg-slate-100 border-slate-200',
          label: 'Elective / Standby',
          iconColor: 'text-slate-500',
        };
    }
  };

  const urgencyStyle = getUrgencyBloodBadgeStyle(request.urgency);

  const getUrgencyBadge = (urgency: BloodRequest['urgency']) => {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${urgencyStyle.tag}`}>
        {urgency === 'CRITICAL' ? (
          <AlertTriangle className={`w-3.5 h-3.5 ${urgencyStyle.iconColor}`} />
        ) : (
          <Clock className={`w-3.5 h-3.5 ${urgencyStyle.iconColor}`} />
        )}
        <span>{urgencyStyle.label}</span>
      </span>
    );
  };

  const getStatusBadge = (status: BloodRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            Seeking Donors
          </span>
        );
      case 'IN_COORDINATION':
        return (
          <span className="text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
            In Coordination
          </span>
        );
      case 'FULFILLED':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Fulfilled
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  const handleShare = async () => {
    const shareText = `[URGENT BLOOD NEED] ${request.bloodGroup} needed for ${request.patientCode} at ${request.hospitalName}, ${request.city}. Coordinate securely on LifeLink: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LifeLink: Urgent ${request.bloodGroup} Needed`,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('Emergency details copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Emergency details copied to clipboard!');
    }
  };

  const fulfillmentPercent = Math.min(
    Math.round((request.unitsFulfilled / request.unitsRequired) * 100),
    100
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {getUrgencyBadge(request.urgency)}
            {getStatusBadge(request.status)}
          </div>
          <button
            onClick={handleShare}
            title="Share Emergency Alert"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Blood Group and Patient Details with DISTINCT COLORS */}
        <div className="flex items-start gap-3.5 mt-2">
          {/* Distinct Blood Group Badge Colored by Urgency (Critical: Red, 6h: Blue, 24h: Green) */}
          <div
            className={`w-14 h-14 rounded-xl ${urgencyStyle.bg} font-extrabold text-2xl flex flex-col items-center justify-center shrink-0 border`}
          >
            <span>{request.bloodGroup}</span>
            <span className="text-[9px] font-semibold tracking-wider opacity-90 uppercase">
              Blood
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Distinct Units Badge (Contrasting Color) */}
              <span
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border shadow-2xs ${getUnitsBadgeClass(
                  request.unitsRequired
                )}`}
              >
                <Droplet className="w-3 h-3 fill-current" />
                <span>
                  {request.unitsRequired} {request.unitsRequired === 1 ? 'Unit Needed' : 'Units Needed'}
                </span>
              </span>

              <span className="text-xs font-mono font-bold text-slate-400">
                {request.patientCode}
              </span>
            </div>

            <div className="mt-1">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide mr-1.5">
                Patient:
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {request.patientName || request.patientCode}
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
              Condition: <span className="font-medium text-slate-800">{request.patientCondition}</span>
            </p>
          </div>
        </div>

        {/* Hospital & Location Info */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-900 truncate">{request.hospitalName}</span>
            {request.hospitalVerified && (
              <span
                title="Verified Healthcare Facility"
                className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200 shrink-0"
              >
                Verified Hospital
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">
              {request.locality}, {request.city}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {request.pledgedDonorsCount} {request.pledgedDonorsCount === 1 ? 'donor pledged' : 'donors pledged'}
              </span>
            </span>
            <span className="text-[11px] font-mono tabular-nums text-slate-600">
              {request.unitsFulfilled} of {request.unitsRequired} units collected
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                request.status === 'FULFILLED'
                  ? 'bg-emerald-500'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${fulfillmentPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {request.status !== 'FULFILLED' && (
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onPledge(request)}
            disabled={userPledged}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs ${
              userPledged
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${userPledged ? 'fill-emerald-600 text-emerald-600' : 'fill-white'}`} />
            <span>{userPledged ? 'Pledged Donation' : 'Pledge Donation'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
