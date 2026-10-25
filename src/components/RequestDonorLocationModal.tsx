import React, { useState } from 'react';
import { DonorProfile, BloodGroup, UrgencyLevel } from '../types/index.ts';
import {
  X,
  Phone,
  MapPin,
  Building2,
  Send,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getBloodGroupStyle } from '../utils/bloodColor.ts';

interface RequestDonorLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: DonorProfile | null;
  onSendLocationRequest: (payload: {
    donorId: string;
    donorPhone: string;
    donorTag: string;
    patientInfo: string;
    hospitalName: string;
    hospitalAddress: string;
    city: string;
    unitsNeeded: number;
    bloodGroup: BloodGroup;
    urgency: UrgencyLevel;
    seekerContact: string;
  }) => Promise<any>;
}

export const RequestDonorLocationModal: React.FC<RequestDonorLocationModalProps> = ({
  isOpen,
  onClose,
  donor,
  onSendLocationRequest,
}) => {
  const [patientInfo, setPatientInfo] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [city, setCity] = useState(donor?.city || 'Delhi');
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [urgency, setUrgency] = useState<UrgencyLevel>('HIGH');
  const [seekerContact, setSeekerContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  if (!isOpen || !donor) return null;

  const handleCall = () => {
    window.location.href = `tel:${donor.phone.replace(/\s+/g, '')}`;
  };

  const cleanPhone = donor.phone.replace(/[^0-9]/g, '');

  const quickWhatsappText = encodeURIComponent(
    `Hello ${donor.maskedIdentifier}, I saw your profile on LifeLink. We urgently need ${donor.bloodGroup} blood at ${hospitalName || 'hospital'}. Can you please help?`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName.trim() || !hospitalAddress.trim() || !seekerContact.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await onSendLocationRequest({
        donorId: donor.id,
        donorPhone: donor.phone,
        donorTag: donor.maskedIdentifier,
        patientInfo: patientInfo.trim() || 'Patient in Emergency',
        hospitalName: hospitalName.trim(),
        hospitalAddress: hospitalAddress.trim(),
        city: city.trim() || donor.city,
        unitsNeeded,
        bloodGroup: donor.bloodGroup,
        urgency,
        seekerContact: seekerContact.trim(),
      });

      if (res?.whatsappUrl) {
        setWhatsappLink(res.whatsappUrl);
      }
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit location request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl ${getBloodGroupStyle(donor.bloodGroup).bg} font-bold text-lg flex items-center justify-center shrink-0 shadow-xs border ${getBloodGroupStyle(donor.bloodGroup).border}`}>
              {donor.bloodGroup}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Contact & Request Donor to Location
              </h2>
              <p className="text-xs text-slate-500">
                Directly connect with <strong className="text-slate-800">{donor.fullName || donor.maskedIdentifier}</strong> ({donor.locality}, {donor.city})
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

        {/* Instant Direct Action Strip */}
        <div className="bg-slate-900 text-white p-4 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400 font-medium">Donor Direct Contact Phone:</div>
            <div className="text-base font-mono font-bold text-white mt-0.5">{donor.phone}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCall}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </button>
            <a
              href={`https://wa.me/${cleanPhone}?text=${quickWhatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Location Request Dispatched to {donor.maskedIdentifier}!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Hospital location details have been saved to the coordination channel. You can also call or send WhatsApp directly.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleCall}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call {donor.phone}</span>
              </button>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Message</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-4 py-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hospital / Transfusion Center Name:
              </label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g., AIIMS Delhi Trauma Centre, Apollo Hospitals"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Destination Address / Room / Department:
              </label>
              <input
                type="text"
                required
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
                placeholder="e.g., 2nd Floor Blood Bank Counter / Room 304, ICU Ward"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City:</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Units Needed:</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient Diagnosis / Name:
                </label>
                <input
                  type="text"
                  value={patientInfo}
                  onChange={(e) => setPatientInfo(e.target.value)}
                  placeholder="e.g., Emergency Surgery"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Contact Phone:
                </label>
                <input
                  type="tel"
                  required
                  value={seekerContact}
                  onChange={(e) => setSeekerContact(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Request...' : 'Send Location Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
