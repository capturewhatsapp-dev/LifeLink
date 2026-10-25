import React, { useState } from 'react';
import { BloodGroup, UrgencyLevel, BloodRequest } from '../types/index.ts';
import { X, AlertCircle, Building2, ShieldCheck, HeartPulse } from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: Partial<BloodRequest>) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [patientCondition, setPatientCondition] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [contactPersonRole, setContactPersonRole] = useState('Attending Relative');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientCondition.trim() || !hospitalName.trim()) return;

    onSubmit({
      patientName: patientName.trim(),
      bloodGroup,
      unitsRequired,
      urgency,
      patientCondition: patientCondition.trim(),
      patientCode: patientCode.trim() || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalName: hospitalName.trim(),
      city,
      locality: locality.trim() || 'Central Zone',
      contactPersonRole,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create Urgent Blood Request</h2>
              <p className="text-xs text-slate-500">
                Broadcasts instantly to verified donors and hospital networks
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
          {/* Blood Group and Units */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Required Blood Group:
              </label>
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
              <label className="block font-semibold text-slate-700 mb-1">Units Needed:</label>
              <input
                type="number"
                min={1}
                max={10}
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Urgency Window:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('CRITICAL')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                  urgency === 'CRITICAL'
                    ? 'bg-rose-600 text-white border-rose-600 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <div>Critical</div>
                <div className="text-[10px] opacity-80">&lt; 2 Hours</div>
              </button>
              <button
                type="button"
                onClick={() => setUrgency('HIGH')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                  urgency === 'HIGH'
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <div>High Priority</div>
                <div className="text-[10px] opacity-80">&lt; 6 Hours</div>
              </button>
              <button
                type="button"
                onClick={() => setUrgency('MODERATE')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-all ${
                  urgency === 'MODERATE'
                    ? 'bg-slate-800 text-white border-slate-800 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <div>Standard</div>
                <div className="text-[10px] opacity-80">Within 24h</div>
              </button>
            </div>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Patient Full Name:
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g., Sunita Rao / Rajesh Verma / Aarav"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Medical Condition & Patient Code */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Condition / Diagnosis:
            </label>
            <input
              type="text"
              required
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
              placeholder="e.g., Emergency Pediatric Cardiac Surgery, Dengue Platelet Apheresis"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Patient Code (for privacy):
              </label>
              <input
                type="text"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                placeholder="e.g., PT-8921"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Role:</label>
              <select
                value={contactPersonRole}
                onChange={(e) => setContactPersonRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Hospital Staff / ICU Desk">Hospital Staff / ICU Desk</option>
                <option value="Attending Relative">Attending Relative</option>
                <option value="Transfusion Officer">Transfusion Officer</option>
                <option value="Social Worker">Social Worker</option>
              </select>
            </div>
          </div>

          {/* Hospital & Location */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hospital Name:</label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="e.g., Apollo Childrens Hospital / Max Super Speciality"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City:</label>
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Locality / Area:</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g., Bandra West / Saket"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Reassurance Notice */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2 text-emerald-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Safe Coordination Guarantee:</span> A dedicated
              real-time coordination channel will be created immediately. Donors can chat directly
              without exposing personal phone numbers.
            </div>
          </div>

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
              className="px-5 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Broadcast Urgent Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
