import React, { useState } from 'react';
import { BloodGroup } from '../types/index.ts';
import { X, Heart, Phone, MapPin, UserCheck } from 'lucide-react';

interface DonorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (donorData: {
    fullName: string;
    bloodGroup: BloodGroup;
    city: string;
    locality: string;
    travelRadiusKm: number;
    phone: string;
    weightKg: number;
  }) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

export const DonorRegistrationModal: React.FC<DonorRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('Delhi');
  const [locality, setLocality] = useState('');
  const [phone, setPhone] = useState('');
  const [travelRadiusKm, setTravelRadiusKm] = useState(15);
  const [weightKg, setWeightKg] = useState(65);
  const [isHealthy, setIsHealthy] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city) return;

    onRegister({
      fullName: fullName.trim(),
      bloodGroup,
      city,
      locality: locality.trim() || 'Central Zone',
      travelRadiusKm: Number(travelRadiusKm),
      phone: phone.trim(),
      weightKg: Number(weightKg),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Register as a Blood Donor</h2>
              <p className="text-xs text-slate-500">
                Patients and seekers in your city can call you directly when blood is needed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Donor Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Your Full Name (Displayed on Donor Profile):
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Rahul Sharma / Dr. Priya Sen"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Blood Group and City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your City:</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Area / Locality and Travel Radius */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area / Locality:</label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g., Saket / Rohini / Bandra"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Willing to Travel (km):
              </label>
              <select
                value={travelRadiusKm}
                onChange={(e) => setTravelRadiusKm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={15}>Within 15 km</option>
                <option value={25}>Within 25 km</option>
                <option value={50}>Anywhere in City (Emergency)</option>
              </select>
            </div>
          </div>

          {/* Mobile Number for Seekers to Call */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
            <label className="block font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Mobile Number (Seekers will call you directly):</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98201 12345"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-emerald-800">
              This contact number will be listed on your donor profile so patients or hospital attendants can call you immediately.
            </p>
          </div>

          {/* Quick Health & Weight Eligibility Check */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>Eligibility Checklist:</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Body Weight (kg) [Min 50 kg]:</label>
                <input
                  type="number"
                  min={40}
                  max={150}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHealthy}
                    onChange={(e) => setIsHealthy(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-slate-700">I am currently healthy with no active fever/infections</span>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fullName.trim() || !phone.trim()}
              className="px-5 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 rounded-lg shadow-xs transition-colors"
            >
              Register as Blood Donor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
