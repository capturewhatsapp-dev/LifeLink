import { BloodGroup } from '../types/index.ts';

export function getBloodGroupStyle(group: BloodGroup): {
  bg: string;
  badge: string;
  border: string;
  text: string;
} {
  switch (group) {
    case 'O+':
      return {
        bg: 'bg-rose-600 text-white',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        border: 'border-rose-600',
        text: 'text-rose-600',
      };
    case 'O-':
      return {
        bg: 'bg-red-700 text-white',
        badge: 'bg-red-50 text-red-800 border-red-200',
        border: 'border-red-700',
        text: 'text-red-700',
      };
    case 'A+':
      return {
        bg: 'bg-emerald-600 text-white',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        border: 'border-emerald-600',
        text: 'text-emerald-700',
      };
    case 'A-':
      return {
        bg: 'bg-teal-700 text-white',
        badge: 'bg-teal-50 text-teal-800 border-teal-200',
        border: 'border-teal-700',
        text: 'text-teal-700',
      };
    case 'B+':
      return {
        bg: 'bg-blue-600 text-white',
        badge: 'bg-blue-50 text-blue-800 border-blue-200',
        border: 'border-blue-600',
        text: 'text-blue-700',
      };
    case 'B-':
      return {
        bg: 'bg-sky-700 text-white',
        badge: 'bg-sky-50 text-sky-800 border-sky-200',
        border: 'border-sky-700',
        text: 'text-sky-700',
      };
    case 'AB+':
      return {
        bg: 'bg-purple-600 text-white',
        badge: 'bg-purple-50 text-purple-800 border-purple-200',
        border: 'border-purple-600',
        text: 'text-purple-700',
      };
    case 'AB-':
      return {
        bg: 'bg-indigo-700 text-white',
        badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        border: 'border-indigo-700',
        text: 'text-indigo-700',
      };
    default:
      return {
        bg: 'bg-slate-800 text-white',
        badge: 'bg-slate-100 text-slate-800 border-slate-200',
        border: 'border-slate-800',
        text: 'text-slate-800',
      };
  }
}

export function getUnitsBadgeClass(units: number): string {
  if (units >= 4) {
    return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
  } else if (units >= 2) {
    return 'bg-orange-100 text-orange-950 border-orange-300 font-bold';
  } else {
    return 'bg-sky-100 text-sky-900 border-sky-300 font-semibold';
  }
}

// >10 units in Green, 5 to 10 in Light Blue, 0 to 4 in Light Red
export function getHospitalStockColor(units: number): {
  badgeClass: string;
  pillClass: string;
  label: string;
  level: 'safe' | 'moderate' | 'critical';
} {
  if (units > 10) {
    return {
      badgeClass: 'bg-emerald-100/90 text-emerald-950 border-emerald-300 font-bold',
      pillClass: 'bg-emerald-600 text-white',
      label: '>10 Units (Sufficient Stock)',
      level: 'safe',
    };
  } else if (units >= 5) {
    return {
      badgeClass: 'bg-sky-100/90 text-sky-950 border-sky-300 font-bold',
      pillClass: 'bg-sky-600 text-white',
      label: '5–10 Units (Light Blue · Moderate Stock)',
      level: 'moderate',
    };
  } else {
    return {
      badgeClass: 'bg-rose-100/90 text-rose-950 border-rose-300 font-bold',
      pillClass: 'bg-rose-600 text-white',
      label: '0–4 Units (Low / Critical Stock)',
      level: 'critical',
    };
  }
}
