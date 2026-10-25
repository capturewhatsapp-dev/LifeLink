import React, { useState, useEffect } from 'react';
import type {
  BloodRequest,
  DonorProfile,
  VerifiedOrganization,
  AwarenessCampaignMedia,
  BloodGroup,
  LocationRequestPayload,
} from './types/index.ts';
import { Header } from './components/Header.tsx';
import { RequestCard } from './components/RequestCard.tsx';
import { DonorCard } from './components/DonorCard.tsx';
import { CompatibilityMatrix } from './components/CompatibilityMatrix.tsx';
import { VerifiedOrganizationsView } from './components/VerifiedOrganizationsView.tsx';
import { AwarenessCampaignView } from './components/AwarenessCampaignView.tsx';
import { PrivacySecurityPolicyView } from './components/PrivacySecurityPolicyView.tsx';
import { NewRequestModal } from './components/NewRequestModal.tsx';
import { DonorRegistrationModal } from './components/DonorRegistrationModal.tsx';
import { RealtimeChatModal } from './components/RealtimeChatModal.tsx';
import { RequestDonorLocationModal } from './components/RequestDonorLocationModal.tsx';
import {
  Droplet,
  Search,
  Filter,
  Users,
  Building2,
  Phone,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const CITIES = ['ALL', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'requests' | 'donors' | 'organizations' | 'campaigns' | 'privacy'
  >('requests');

  // Core Data
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [organizations, setOrganizations] = useState<VerifiedOrganization[]>([]);
  const [campaigns, setCampaigns] = useState<AwarenessCampaignMedia[]>([]);

  // Filter States
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pledgedRequestIds, setPledgedRequestIds] = useState<Set<string>>(new Set());

  // Modals
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isDonorRegisterOpen, setIsDonorRegisterOpen] = useState(false);
  const [locationModalDonor, setLocationModalDonor] = useState<DonorProfile | null>(null);
  const [chatModalState, setChatModalState] = useState<{
    isOpen: boolean;
    request?: BloodRequest | null;
    donor?: DonorProfile | null;
  }>({ isOpen: false });

  // Current User Session
  const [myDonorProfile, setMyDonorProfile] = useState<DonorProfile | null>(null);

  // Initial Fetch
  useEffect(() => {
    fetch('/api/requests')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRequests(data))
      .catch((err) => console.error('Error fetching requests:', err));

    fetch('/api/donors')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDonors(data))
      .catch((err) => console.error('Error fetching donors:', err));

    fetch('/api/organizations')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setOrganizations(data))
      .catch((err) => console.error('Error fetching organizations:', err));

    fetch('/api/campaigns')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCampaigns(data))
      .catch((err) => console.error('Error fetching campaigns:', err));
  }, []);

  // Filtered Requests: Only show requests where blood is actively needed (exclude fulfilled)
  const filteredRequests = requests.filter((req) => {
    // Exclude completed/fulfilled requests (only show patients who still require blood)
    if (req.status === 'FULFILLED' || req.unitsFulfilled >= req.unitsRequired) {
      return false;
    }

    const matchesGroup = selectedBloodGroup === 'ALL' || req.bloodGroup === selectedBloodGroup;
    const matchesCity = selectedCity === 'ALL' || req.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesUrgency = selectedUrgency === 'ALL' || req.urgency === selectedUrgency;
    const matchesSearch =
      !searchQuery.trim() ||
      (req.patientName && req.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.patientCondition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.patientCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesCity && matchesUrgency && matchesSearch;
  });

  // Filtered Donors: Displaying registered donor full name
  const filteredDonors = donors.filter((donor) => {
    const matchesGroup = selectedBloodGroup === 'ALL' || donor.bloodGroup === selectedBloodGroup;
    const matchesCity = selectedCity === 'ALL' || donor.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      (donor.fullName && donor.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      donor.maskedIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.phone.includes(searchQuery);
    return matchesGroup && matchesCity && matchesSearch;
  });

  // Handler: Create Blood Request
  const handleCreateRequest = async (requestData: Partial<BloodRequest>) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (res.ok) {
        const created: BloodRequest = await res.json();
        setRequests((prev) => [created, ...prev]);
        setActiveTab('requests');
      }
    } catch (err) {
      console.error('Failed to create request:', err);
    }
  };

  // Handler: Register Donor
  const handleRegisterDonor = async (donorData: any) => {
    try {
      const res = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData),
      });
      if (res.ok) {
        const created: DonorProfile = await res.json();
        setMyDonorProfile(created);
        setDonors((prev) => [created, ...prev]);
        setActiveTab('donors');
      }
    } catch (err) {
      console.error('Failed to register donor:', err);
    }
  };

  // Handler: Send Hospital Location Request to Donor
  const handleSendLocationRequest = async (payload: LocationRequestPayload) => {
    const res = await fetch('/api/requests/location-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error('Failed to send location request');
    }
    return res.json();
  };

  // Handler: Pledge Blood Donation
  const handlePledgeDonation = async (request: BloodRequest) => {
    try {
      const res = await fetch(`/api/requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementPledge: true, status: 'IN_COORDINATION' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) => prev.map((r) => (r.id === request.id ? updated : r)));
        setPledgedRequestIds((prev) => new Set(prev).add(request.id));
      }
    } catch (err) {
      console.error('Failed to pledge:', err);
    }
  };

  const urgentCount = requests.filter((r) => r.urgency === 'CRITICAL' && r.status !== 'FULFILLED').length;
  const totalUnitsFulfilled = requests.reduce((sum, r) => sum + r.unitsFulfilled, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Header (Clean Top-Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestBlood={() => setIsNewRequestOpen(true)}
        onRegisterDonor={() => setIsDonorRegisterOpen(true)}
        urgentCount={urgentCount}
      />

      {/* Emergency Hotline Ticker Ribbon */}
      <div className="bg-rose-900 text-rose-100 px-4 py-2 text-xs border-b border-rose-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block animate-pulse" />
            <span className="font-semibold text-white">Emergency Blood Helpline:</span>
            <span>Dial 104</span>
            <span className="text-rose-400/80">•</span>
            <span className="font-semibold text-white">LifeLink Personal Care Toll Free:</span>
            <a
              href="tel:1800108108"
              className="font-bold text-amber-300 hover:text-white underline inline-flex items-center gap-1 font-mono text-[13px]"
            >
              <Phone className="w-3 h-3" />
              1800 108 108
            </a>
          </div>
          <div className="hidden md:flex items-center gap-3 text-rose-200">
            <span>24x7 Free Patient & Donor Support</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('privacy')}
              className="text-amber-200 hover:text-white underline transition-colors"
            >
              Policies & Support Helpdesk
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Dynamic Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {urgentCount}
              </div>
              <div className="text-xs text-slate-500 font-medium">Critical Needs (&lt;2h)</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {donors.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">Active Donors Ready to Call</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {organizations.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">Partner Blood Banks</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {totalUnitsFulfilled} Units
              </div>
              <div className="text-xs text-slate-500 font-medium">Transfusions Completed</div>
            </div>
          </div>
        </div>

        {/* Tab 1: Urgent Blood Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Search & Location Filter Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by hospital, city, condition, or patient code..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c === 'ALL' ? 'All Locations' : `Location: ${c}`}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
                  >
                    <option value="ALL">All Urgencies</option>
                    <option value="CRITICAL">Critical (&lt;2h)</option>
                    <option value="HIGH">High Priority (&lt;6h)</option>
                    <option value="MODERATE">Standard (&lt;24h)</option>
                  </select>
                </div>
              </div>

              {/* Blood Group Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide shrink-0 mr-1">
                  Required Group:
                </span>
                <button
                  onClick={() => setSelectedBloodGroup('ALL')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedBloodGroup === 'ALL'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Groups
                </button>
                {BLOOD_GROUPS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedBloodGroup(g)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedBloodGroup === g
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests Grid */}
            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  No active requests matching your current filters
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Try clearing the city or blood group filter to view requirements from adjacent medical zones.
                </p>
                <button
                  onClick={() => {
                    setSelectedBloodGroup('ALL');
                    setSelectedCity('ALL');
                    setSelectedUrgency('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    userPledged={pledgedRequestIds.has(request.id)}
                    onOpenChat={(req) => setChatModalState({ isOpen: true, request: req })}
                    onPledge={handlePledgeDonation}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Find Donors Directory */}
        {activeTab === 'donors' && (
          <div className="space-y-6">
            {/* Directory Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Filter by City:
                  </span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 flex-1 sm:flex-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c === 'ALL' ? 'All Locations' : c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  {filteredDonors.length} Verified Donors Available
                </div>
              </div>

              {/* Blood Group Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide shrink-0 mr-1">
                  Blood Group:
                </span>
                <button
                  onClick={() => setSelectedBloodGroup('ALL')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedBloodGroup === 'ALL'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Groups
                </button>
                {BLOOD_GROUPS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedBloodGroup(g)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedBloodGroup === g
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Donors Grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDonors.map((donor) => (
                  <DonorCard
                    key={donor.id}
                    donor={donor}
                    isCurrentUser={donor.id === myDonorProfile?.id}
                    onRequestLocation={(d) => setLocationModalDonor(d)}
                    onOpenChat={(d) => setChatModalState({ isOpen: true, donor: d })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 5 Partner Blood Banks & Hospitals */}
        {activeTab === 'organizations' && (
          <VerifiedOrganizationsView organizations={organizations} />
        )}

        {/* Tab 4: Clean Awareness Hub & Blood Compatibility Rules */}
        {activeTab === 'campaigns' && (
          <div className="space-y-8">
            <CompatibilityMatrix
              onSelectGroupForSearch={(group) => {
                setSelectedBloodGroup(group);
                setActiveTab('requests');
              }}
            />
            <AwarenessCampaignView campaigns={campaigns} />
          </div>
        )}

        {/* Tab 5: Dedicated Privacy, Health Data Protection & Policies */}
        {activeTab === 'privacy' && <PrivacySecurityPolicyView />}
      </main>

      {/* Modals */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleCreateRequest}
      />

      <DonorRegistrationModal
        isOpen={isDonorRegisterOpen}
        onClose={() => setIsDonorRegisterOpen(false)}
        onRegister={handleRegisterDonor}
      />

      <RequestDonorLocationModal
        isOpen={Boolean(locationModalDonor)}
        donor={locationModalDonor}
        onClose={() => setLocationModalDonor(null)}
        onSendLocationRequest={handleSendLocationRequest}
      />

      <RealtimeChatModal
        isOpen={chatModalState.isOpen}
        onClose={() => setChatModalState({ isOpen: false })}
        targetRequest={chatModalState.request}
        targetDonor={chatModalState.donor}
        currentUserId={myDonorProfile?.id || 'seeker_guest'}
        currentUserName={
          myDonorProfile
            ? myDonorProfile.maskedIdentifier + ' (You)'
            : 'Patient Attendant / Seeker'
        }
        currentUserRole={myDonorProfile ? 'donor' : 'hospital_rep'}
        onRequestUpdated={(updatedReq) => {
          setRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? updatedReq : r)));
        }}
      />

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900">LifeLink</span>
            <span>·</span>
            <span>Blood Donation Coordination Platform</span>
            <span>·</span>
            <span className="text-rose-700 font-semibold flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Personal Care Toll Free: <a href="tel:1800108108" className="font-mono font-bold hover:underline">1800 108 108</a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('privacy')}
              className="hover:text-slate-700 underline text-slate-600 font-medium"
            >
              Privacy & Security Policies
            </button>
            <span>·</span>
            <span>Partner Blood Banks</span>
            <span>·</span>
            <span>100% Voluntary Donation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
