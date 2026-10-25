import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  BloodRequest,
  DonorProfile,
  VerifiedOrganization,
  AwarenessCampaignMedia,
  ChatMessage,
  BloodGroup,
  LocationRequestPayload,
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json({ limit: '10mb' }));

// Initial Blood Requests with Patient Full Names
let bloodRequests: BloodRequest[] = [
  {
    id: 'req_101',
    patientName: 'Sunita Rao',
    patientCode: 'PT-8921',
    patientCondition: 'Emergency Pediatric Cardiac Surgery',
    bloodGroup: 'O-',
    unitsRequired: 3,
    unitsFulfilled: 1,
    urgency: 'CRITICAL',
    hospitalName: 'Apollo Childrens Hospital',
    hospitalVerified: true,
    city: 'Mumbai',
    locality: 'Bandra West',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    contactPersonRole: 'Cardiothoracic ICU Desk',
    contactPhone: '+91 98200 44101',
    requisitionSlipUrl: 'REF-ICU-8921-VERIFIED',
    status: 'IN_COORDINATION',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    pledgedDonorsCount: 1,
    activeRoomId: 'req_101',
  },
  {
    id: 'req_102',
    patientName: 'Aarav Sharma',
    patientCode: 'PT-3340',
    patientCondition: 'Platelet Transfusion (Dengue Hemorrhagic)',
    bloodGroup: 'B+',
    unitsRequired: 4,
    unitsFulfilled: 2,
    urgency: 'HIGH',
    hospitalName: 'Max Super Speciality Hospital',
    hospitalVerified: true,
    city: 'Delhi',
    locality: 'Saket',
    coordinates: { lat: 28.5244, lng: 77.2157 },
    contactPersonRole: 'Blood Transfusion Officer',
    contactPhone: '+91 98110 33440',
    requisitionSlipUrl: 'REF-BTO-3340-VERIFIED',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    pledgedDonorsCount: 1,
    activeRoomId: 'req_102',
  },
  {
    id: 'req_103',
    patientName: 'Kavita Reddy',
    patientCode: 'PT-4109',
    patientCondition: 'Thalassemia Major Routine Transfusion',
    bloodGroup: 'A+',
    unitsRequired: 2,
    unitsFulfilled: 0,
    urgency: 'MODERATE',
    hospitalName: 'Manipal Hospital',
    hospitalVerified: true,
    city: 'Bengaluru',
    locality: 'Old Airport Road',
    coordinates: { lat: 12.9592, lng: 77.6534 },
    contactPersonRole: 'Daycare Hematology Desk',
    contactPhone: '+91 80250 88109',
    requisitionSlipUrl: 'REF-HEM-4109-VERIFIED',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    pledgedDonorsCount: 0,
    activeRoomId: 'req_103',
  },
  {
    id: 'req_104',
    patientName: 'Meena Mukherjee',
    patientCode: 'PT-5512',
    patientCondition: 'Severe Trauma & Orthopedic Reconstruction',
    bloodGroup: 'AB-',
    unitsRequired: 2,
    unitsFulfilled: 2,
    urgency: 'CRITICAL',
    hospitalName: 'AIIMS Delhi Trauma Centre',
    hospitalVerified: true,
    city: 'Delhi',
    locality: 'Safdarjung Enclave',
    coordinates: { lat: 28.5672, lng: 77.2100 },
    contactPersonRole: 'Emergency Surgery Desk',
    contactPhone: '+91 11265 99512',
    requisitionSlipUrl: 'REF-TRM-5512-VERIFIED',
    status: 'FULFILLED',
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    pledgedDonorsCount: 2,
    activeRoomId: 'req_104',
  },
  {
    id: 'req_105',
    patientName: 'Rajesh Verma',
    patientCode: 'PT-7294',
    patientCondition: 'Postpartum Hemorrhage (Obstetric Emergency)',
    bloodGroup: 'O+',
    unitsRequired: 3,
    unitsFulfilled: 1,
    urgency: 'CRITICAL',
    hospitalName: 'Apollo Hospitals Blood Bank',
    hospitalVerified: true,
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    coordinates: { lat: 17.4399, lng: 78.4983 },
    contactPersonRole: 'Maternity ICU Incharge',
    contactPhone: '+91 97000 66294',
    requisitionSlipUrl: 'REF-MHD-7294-VERIFIED',
    status: 'IN_COORDINATION',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    pledgedDonorsCount: 1,
    activeRoomId: 'req_105',
  },
  {
    id: 'req_106',
    patientName: 'Mohammed Faizan',
    patientCode: 'PT-9901',
    patientCondition: 'Emergency ICU Platelet Support',
    bloodGroup: 'O+',
    unitsRequired: 2,
    unitsFulfilled: 0,
    urgency: 'CRITICAL',
    hospitalName: 'AIIMS Delhi Trauma Centre',
    hospitalVerified: true,
    city: 'Delhi',
    locality: 'Ansari Nagar',
    coordinates: { lat: 28.5672, lng: 77.21 },
    contactPersonRole: 'Trauma Blood Bank Desk',
    contactPhone: '+91 11 2658 8500',
    requisitionSlipUrl: 'REF-AIIMS-9901',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    pledgedDonorsCount: 0,
    activeRoomId: 'req_106',
  },
];

// Voluntary Donors with Full Name and DIRECT CONTACT PHONE
let donorsDatabase: DonorProfile[] = [
  {
    id: 'donor_4089',
    fullName: 'Rahul Sharma',
    maskedIdentifier: 'Donor #4089',
    bloodGroup: 'O-',
    city: 'Mumbai',
    locality: 'Bandra West',
    phone: '+91 98201 11234',
    travelRadiusKm: 15,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-08-10',
    daysUntilEligible: 0,
    donationsCount: 8,
    verifiedBadge: true,
    registeredAt: '2025-02-14',
  },
  {
    id: 'donor_7214',
    fullName: 'Dr. Priya Sen',
    maskedIdentifier: 'Donor #7214',
    bloodGroup: 'B+',
    city: 'Delhi',
    locality: 'Saket / South Extension',
    phone: '+91 98112 55678',
    travelRadiusKm: 20,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-07-22',
    daysUntilEligible: 0,
    donationsCount: 14,
    verifiedBadge: true,
    registeredAt: '2024-11-05',
  },
  {
    id: 'donor_9103',
    fullName: 'Vikram Malhotra',
    maskedIdentifier: 'Donor #9103',
    bloodGroup: 'A+',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    phone: '+91 99801 88990',
    travelRadiusKm: 12,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-09-01',
    daysUntilEligible: 0,
    donationsCount: 5,
    verifiedBadge: true,
    registeredAt: '2025-06-18',
  },
  {
    id: 'donor_3381',
    fullName: 'Sneha Patel',
    maskedIdentifier: 'Donor #3381',
    bloodGroup: 'O+',
    city: 'Hyderabad',
    locality: 'Banjara Hills',
    phone: '+91 97001 33445',
    travelRadiusKm: 25,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-08-15',
    daysUntilEligible: 0,
    donationsCount: 11,
    verifiedBadge: true,
    registeredAt: '2024-08-20',
  },
  {
    id: 'donor_5920',
    fullName: 'Anand Iyer',
    maskedIdentifier: 'Donor #5920',
    bloodGroup: 'AB-',
    city: 'Pune',
    locality: 'Kalyani Nagar',
    phone: '+91 94225 66778',
    travelRadiusKm: 18,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-08-01',
    daysUntilEligible: 0,
    donationsCount: 7,
    verifiedBadge: true,
    registeredAt: '2025-01-10',
  },
  {
    id: 'donor_8140',
    fullName: 'Dr. Shalini Deshmukh',
    maskedIdentifier: 'Donor #8140',
    bloodGroup: 'A-',
    city: 'Delhi',
    locality: 'Connaught Place / Karol Bagh',
    phone: '+91 98103 44912',
    travelRadiusKm: 15,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-07-10',
    daysUntilEligible: 0,
    donationsCount: 6,
    verifiedBadge: true,
    registeredAt: '2025-03-21',
  },
  {
    id: 'donor_2265',
    fullName: 'Karan Singhania',
    maskedIdentifier: 'Donor #2265',
    bloodGroup: 'AB+',
    city: 'Chennai',
    locality: 'T. Nagar / Thousand Lights',
    phone: '+91 94441 77820',
    travelRadiusKm: 20,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-09-12',
    daysUntilEligible: 0,
    donationsCount: 9,
    verifiedBadge: true,
    registeredAt: '2024-09-15',
  },
  {
    id: 'donor_6019',
    fullName: 'Neha Kapoor',
    maskedIdentifier: 'Donor #6019',
    bloodGroup: 'B-',
    city: 'Mumbai',
    locality: 'Andheri East',
    phone: '+91 98205 99310',
    travelRadiusKm: 20,
    availability: 'AVAILABLE',
    lastDonationDate: '2026-08-28',
    daysUntilEligible: 0,
    donationsCount: 4,
    verifiedBadge: true,
    registeredAt: '2025-04-12',
  },
];

// 5 Verified Partner Blood Banks, Diagnostic Centers, and Hospital Transfusion Units:
// AIIMS Delhi, Apollo Hospitals, Redcliffe Labs, Dr. Lal PathLabs, Apollo Pharmacy
let verifiedOrganizations: VerifiedOrganization[] = [
  {
    id: 'org_1',
    name: 'AIIMS Delhi Blood Bank & Transfusion Medicine',
    type: 'Government Hospital',
    licenseNumber: 'DL-AIIMS-0101-GOV',
    city: 'Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    emergencyContact: '+91 11 2658 8500',
    operates24x7: true,
    currentStock: { 'A+': 36, 'A-': 9, 'B+': 44, 'B-': 8, 'AB+': 18, 'AB-': 4, 'O+': 52, 'O-': 12 },
    lastStockAudit: '2026-10-25 06:00 IST',
    verifiedBadge: true,
  },
  {
    id: 'org_2',
    name: 'Apollo Hospitals Blood Bank & Apheresis Unit',
    type: 'Multispecialty Hospital',
    licenseNumber: 'TN-APO-7721-HOSP',
    city: 'Chennai',
    address: '21 Greams Lane, Thousand Lights, Chennai 600006',
    emergencyContact: '+91 44 2829 0200',
    operates24x7: true,
    currentStock: { 'A+': 24, 'A-': 6, 'B+': 31, 'B-': 5, 'AB+': 12, 'AB-': 3, 'O+': 39, 'O-': 7 },
    lastStockAudit: '2026-10-25 05:45 IST',
    verifiedBadge: true,
  },
  {
    id: 'org_3',
    name: 'Redcliffe Labs Blood Centre & Transfusion Care',
    type: 'Diagnostic & Blood Centre',
    licenseNumber: 'UP-REDCLF-8820-LIC',
    city: 'Delhi',
    address: 'Redcliffe House, Block H, Sector 63, Noida / Delhi NCR 201301',
    emergencyContact: '+91 898 898 8787',
    operates24x7: true,
    currentStock: { 'A+': 19, 'A-': 4, 'B+': 26, 'B-': 4, 'AB+': 9, 'AB-': 2, 'O+': 33, 'O-': 5 },
    lastStockAudit: '2026-10-25 07:15 IST',
    verifiedBadge: true,
  },
  {
    id: 'org_4',
    name: 'Dr. Lal PathLabs Blood Services & Diagnostics',
    type: 'Diagnostic & Blood Centre',
    licenseNumber: 'DL-LALPATH-4412-MED',
    city: 'Delhi',
    address: 'National Reference Lab, Sector 18, Block E, Rohini, Delhi 110085',
    emergencyContact: '+91 11 3988 5050',
    operates24x7: true,
    currentStock: { 'A+': 22, 'A-': 5, 'B+': 29, 'B-': 6, 'AB+': 11, 'AB-': 3, 'O+': 35, 'O-': 6 },
    lastStockAudit: '2026-10-25 06:30 IST',
    verifiedBadge: true,
  },
  {
    id: 'org_5',
    name: 'Apollo Pharmacy & 24/7 Emergency Blood Coordination',
    type: 'Pharmacy & Blood Desk',
    licenseNumber: 'TS-APOPHARM-9910-RX',
    city: 'Hyderabad',
    address: 'Apollo Health City, Road No 92, Jubilee Hills, Hyderabad 500033',
    emergencyContact: '+91 40 2360 7777',
    operates24x7: true,
    currentStock: { 'A+': 17, 'A-': 3, 'B+': 23, 'B-': 4, 'AB+': 8, 'AB-': 2, 'O+': 28, 'O-': 4 },
    lastStockAudit: '2026-10-25 08:00 IST',
    verifiedBadge: true,
  },
];

// Clean, High-Impact Awareness Campaigns without unwanted clutter
let awarenessCampaigns: AwarenessCampaignMedia[] = [
  {
    id: 'camp_1',
    title: '1 Unit Saves 3 Lives: How Blood Components Help',
    category: 'Infographic',
    summary: 'One whole blood unit is separated into Red Blood Cells, Platelets, and Fresh Frozen Plasma, supporting trauma, chemotherapy, and burn surgery patients simultaneously.',
    keyTakeaways: [
      'Red Blood Cells: Critical for acute accident trauma, surgeries, and severe anemia.',
      'Platelets: Crucial for cancer chemotherapy and dengue fever management.',
      'Plasma (FFP): Treats severe burns, liver dysfunction, and hemophilia clotting needs.',
    ],
    imageUrl: '',
    cloudinaryId: 'cld_lifelink_science_components_v1',
    format: 'webp',
    tags: ['BloodComponents', 'SaveLives', 'HospitalCare'],
    shareCount: 1840,
    downloadSize: '320 KB',
  },
  {
    id: 'camp_2',
    title: 'Donor Eligibility: Who Can Donate Today?',
    category: 'Donor Guide',
    summary: 'A simple clinical checklist before walking into any certified hospital blood bank or voluntary camp.',
    keyTakeaways: [
      'Age between 18 and 65 years with weight ≥ 50 kg.',
      'Minimum interval of 56 days (8 weeks) between whole blood donations.',
      'Free from acute infection, fever, or antibiotic treatment in the last 48 hours.',
      'Normal hemoglobin (≥ 12.5 g/dL) tested instantly on-site for free.',
    ],
    imageUrl: '',
    cloudinaryId: 'cld_lifelink_eligibility_checklist_v1',
    format: 'webp',
    tags: ['Eligibility', 'Preparation', 'HealthCheck'],
    shareCount: 1420,
    downloadSize: '280 KB',
  },
  {
    id: 'camp_3',
    title: 'Debunking 4 Common Blood Donation Myths',
    category: 'Myths vs Facts',
    summary: 'Evidence-based facts to dissolve hesitation and anxiety about voluntary donation.',
    keyTakeaways: [
      'Myth: Donation causes weakness. Fact: Blood plasma volume replenishes completely within 24 to 48 hours.',
      'Myth: You can get infections. Fact: All kits and needles are 100% sterile and disposed of immediately.',
      'Myth: The process takes hours. Fact: The actual collection time takes only 8 to 10 minutes.',
      'Myth: Obese or thin people cannot donate. Fact: Any healthy adult over 50 kg with adequate Hb is eligible.',
    ],
    imageUrl: '',
    cloudinaryId: 'cld_lifelink_myths_facts_v1',
    format: 'png',
    tags: ['FactsOnly', 'ClinicalSafety', 'Volunteer'],
    shareCount: 2650,
    downloadSize: '350 KB',
  },
  {
    id: 'camp_4',
    title: 'Universal Donors & Rare Rh-Negative Types (O- & AB-)',
    category: 'Social Poster',
    summary: 'Why emergency trauma wards and neonatal ICUs depend continuously on O-negative reserve stocks.',
    keyTakeaways: [
      'O- is universal for Red Blood Cells: can be transfused in Code Blue accidents before typing.',
      'AB- is the rarest blood group: universal for life-saving plasma transfusions.',
      'Scheduled donations help blood banks maintain emergency buffers without stock-outs.',
    ],
    imageUrl: '',
    cloudinaryId: 'cld_lifelink_rare_types_v1',
    format: 'jpg',
    tags: ['RareBlood', 'EmergencyCare', 'ONegative'],
    shareCount: 3120,
    downloadSize: '410 KB',
  },
];

// In-Memory Chat Storage
let chatHistory: Record<string, ChatMessage[]> = {
  req_101: [
    {
      id: 'msg_1',
      roomId: 'req_101',
      senderId: 'system',
      senderName: 'LifeLink Desk',
      senderRole: 'system',
      text: 'Direct coordination initialized for Request #PT-8921 (O- Blood Needed at Apollo Childrens Hospital). Voluntary donation only.',
      timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      isSystemNotice: true,
    },
    {
      id: 'msg_2',
      roomId: 'req_101',
      senderId: 'seeker_1',
      senderName: 'Apollo Childrens Hospital (Cardiothoracic ICU)',
      senderRole: 'hospital_rep',
      text: 'Child is in urgent surgery preparation. We require 2 matching O- units. Please contact our blood bank counter at 2nd floor.',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
  ],
};

// REST API Endpoints

// 1. Get Requests
app.get('/api/requests', (req, res) => {
  const { bloodGroup, city, urgency, status } = req.query;
  let filtered = [...bloodRequests];

  if (bloodGroup && bloodGroup !== 'ALL') {
    filtered = filtered.filter((r) => r.bloodGroup === bloodGroup);
  }
  if (city && city !== 'ALL') {
    filtered = filtered.filter((r) => r.city.toLowerCase() === String(city).toLowerCase());
  }
  if (urgency && urgency !== 'ALL') {
    filtered = filtered.filter((r) => r.urgency === urgency);
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }

  filtered.sort((a, b) => {
    const priorityMap = { CRITICAL: 0, HIGH: 1, MODERATE: 2, STANDBY: 3 };
    if (priorityMap[a.urgency] !== priorityMap[b.urgency]) {
      return priorityMap[a.urgency] - priorityMap[b.urgency];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json(filtered);
});

// 2. Post New Blood Request
app.post('/api/requests', (req, res) => {
  const {
    patientName,
    patientCode,
    patientCondition,
    bloodGroup,
    unitsRequired,
    urgency,
    hospitalName,
    city,
    locality,
    contactPersonRole,
    contactPhone,
  } = req.body;

  if (!patientCondition || !bloodGroup || !hospitalName || !city) {
    return res.status(400).json({ error: 'Missing mandatory request fields.' });
  }

  const newId = `req_${Date.now()}`;
  const code = patientCode?.trim() || `PT-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRequest: BloodRequest = {
    id: newId,
    patientName: patientName?.trim() || code,
    patientCode: code,
    patientCondition: patientCondition.trim(),
    bloodGroup: bloodGroup as BloodGroup,
    unitsRequired: Number(unitsRequired) || 1,
    unitsFulfilled: 0,
    urgency: urgency || 'HIGH',
    hospitalName: hospitalName.trim(),
    hospitalVerified: true,
    city: city.trim(),
    locality: locality?.trim() || 'Central District',
    coordinates: { lat: 19.076, lng: 72.877 },
    contactPersonRole: contactPersonRole?.trim() || 'Attendant',
    contactPhone: contactPhone?.trim() || '+91 98000 00000',
    requisitionSlipUrl: `REF-${code}-REG`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    pledgedDonorsCount: 0,
    activeRoomId: newId,
  };

  bloodRequests.unshift(newRequest);

  chatHistory[newId] = [
    {
      id: `msg_${Date.now()}`,
      roomId: newId,
      senderId: 'system',
      senderName: 'LifeLink Desk',
      senderRole: 'system',
      text: `Coordination room initialized for ${newRequest.patientCode} (${newRequest.bloodGroup} needed at ${newRequest.hospitalName}).`,
      timestamp: new Date().toISOString(),
      isSystemNotice: true,
    },
  ];

  res.status(201).json(newRequest);
});

// 3. Location Request endpoint: Seeker requests a donor to come to hospital / specific location
app.post('/api/requests/location-request', (req, res) => {
  const payload: LocationRequestPayload = req.body;
  if (!payload.donorId || !payload.hospitalName || !payload.hospitalAddress) {
    return res.status(400).json({ error: 'Missing donor or hospital location details.' });
  }

  const roomId = `donor_req_${payload.donorId}`;
  if (!chatHistory[roomId]) {
    chatHistory[roomId] = [];
  }

  const newMsg: ChatMessage = {
    id: `msg_loc_${Date.now()}`,
    roomId,
    senderId: 'seeker',
    senderName: payload.patientInfo || 'Patient Attendant',
    senderRole: 'seeker',
    text: `🚨 URGENT HOSPITAL ARRIVAL REQUEST: We need ${payload.unitsNeeded} unit(s) of ${payload.bloodGroup} blood for ${payload.patientInfo}. Destination: ${payload.hospitalName}, ${payload.hospitalAddress}, ${payload.city}. Urgency: ${payload.urgency}. Please contact: ${payload.seekerContact}`,
    timestamp: new Date().toISOString(),
    actionType: 'location_request',
    locationDetails: {
      hospitalName: payload.hospitalName,
      address: payload.hospitalAddress,
      city: payload.city,
    },
  };

  chatHistory[roomId].push(newMsg);

  res.status(201).json({
    success: true,
    message: 'Location request recorded and sent to donor.',
    roomId,
    whatsappUrl: `https://wa.me/${payload.donorPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      `Hello ${payload.donorTag}, urgent request from LifeLink: We urgently need ${payload.unitsNeeded} unit(s) of ${payload.bloodGroup} blood at ${payload.hospitalName}, ${payload.hospitalAddress}, ${payload.city}. Can you please come to this location? Contact: ${payload.seekerContact}`
    )}`,
  });
});

// 4. Update Request Status or Units
app.patch('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const request = bloodRequests.find((r) => r.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const { status, unitsFulfilled, incrementPledge } = req.body;

  if (status) request.status = status;
  if (typeof unitsFulfilled === 'number') request.unitsFulfilled = unitsFulfilled;
  if (incrementPledge) request.pledgedDonorsCount += 1;

  res.json(request);
});

// 5. Get Donors with DIRECT CONTACT PHONE for seekers to call
app.get('/api/donors', (req, res) => {
  const { bloodGroup, city, availability } = req.query;
  let filtered = [...donorsDatabase];

  if (bloodGroup && bloodGroup !== 'ALL') {
    filtered = filtered.filter((d) => d.bloodGroup === bloodGroup);
  }
  if (city && city !== 'ALL') {
    filtered = filtered.filter((d) => d.city.toLowerCase() === String(city).toLowerCase());
  }
  if (availability && availability !== 'ALL') {
    filtered = filtered.filter((d) => d.availability === availability);
  }

  res.json(filtered);
});

// 6. Register Donor with Person Full Name and direct contact phone
app.post('/api/donors', (req, res) => {
  const { fullName, bloodGroup, city, locality, travelRadiusKm, phone } = req.body;

  if (!bloodGroup || !city || !phone) {
    return res.status(400).json({ error: 'Blood group, city, and verified contact phone are required.' });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const donorId = `donor_${randomNum}`;

  const newDonor: DonorProfile = {
    id: donorId,
    fullName: fullName?.trim() || `Donor #${randomNum}`,
    maskedIdentifier: `Donor #${randomNum}`,
    bloodGroup: bloodGroup as BloodGroup,
    city: city.trim(),
    locality: locality?.trim() || 'Central City',
    phone: phone.trim(),
    travelRadiusKm: Number(travelRadiusKm) || 15,
    availability: 'AVAILABLE',
    daysUntilEligible: 0,
    donationsCount: 1,
    verifiedBadge: true,
    registeredAt: new Date().toISOString().split('T')[0],
    isCurrentUser: true,
  };

  donorsDatabase.unshift(newDonor);
  res.status(201).json(newDonor);
});

// 7. Toggle Donor Availability
app.patch('/api/donors/:id/availability', (req, res) => {
  const { id } = req.params;
  const donor = donorsDatabase.find((d) => d.id === id);
  if (!donor) {
    return res.status(404).json({ error: 'Donor not found' });
  }

  const { availability } = req.body;
  if (availability) {
    donor.availability = availability;
  }
  res.json(donor);
});

// 8. Get Verified Partner Organizations (5 Featured Facilities)
app.get('/api/organizations', (req, res) => {
  const { city } = req.query;
  let filtered = [...verifiedOrganizations];
  if (city && city !== 'ALL') {
    filtered = filtered.filter((o) => o.city.toLowerCase() === String(city).toLowerCase());
  }
  res.json(filtered);
});

// 9. Awareness Campaigns
app.get('/api/campaigns', (_req, res) => {
  res.json(awarenessCampaigns);
});

// 10. Chat Room History
app.get('/api/chat/:roomId', (req, res) => {
  const { roomId } = req.params;
  const messages = chatHistory[roomId] || [];
  res.json(messages);
});

// WebSocket Real-Time Infrastructure
interface ClientConnection {
  ws: WebSocket;
  roomId?: string;
  userId?: string;
  userName?: string;
}

const activeClients = new Set<ClientConnection>();

wss.on('connection', (ws: WebSocket) => {
  const client: ClientConnection = { ws };
  activeClients.add(client);

  ws.on('message', (data: string) => {
    try {
      const parsed = JSON.parse(data.toString());
      const { type, roomId, message, user, isTyping } = parsed;

      if (type === 'join') {
        client.roomId = roomId;
        client.userId = user?.id || 'anon';
        client.userName = user?.name || 'User';

        const history = chatHistory[roomId] || [];
        ws.send(
          JSON.stringify({
            type: 'history',
            roomId,
            messages: history,
          })
        );
        return;
      }

      if (type === 'message' && roomId && message) {
        if (!chatHistory[roomId]) {
          chatHistory[roomId] = [];
        }

        const newMsg: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          roomId,
          senderId: client.userId || 'anon',
          senderName: client.userName || 'Participant',
          senderRole: (message.senderRole as any) || 'donor',
          text: message.text || '',
          timestamp: new Date().toISOString(),
          actionType: message.actionType,
          locationDetails: message.locationDetails,
        };

        chatHistory[roomId].push(newMsg);

        if (message.actionType === 'pledge') {
          const reqItem = bloodRequests.find((r) => r.id === roomId);
          if (reqItem) {
            reqItem.pledgedDonorsCount += 1;
            if (reqItem.status === 'PENDING') {
              reqItem.status = 'IN_COORDINATION';
            }
          }
        } else if (message.actionType === 'fulfilled') {
          const reqItem = bloodRequests.find((r) => r.id === roomId);
          if (reqItem) {
            reqItem.status = 'FULFILLED';
            reqItem.unitsFulfilled = Math.max(reqItem.unitsFulfilled + 1, reqItem.unitsRequired);
          }
        }

        const payload = JSON.stringify({
          type: 'message',
          roomId,
          message: newMsg,
          requestUpdate: bloodRequests.find((r) => r.id === roomId),
        });

        for (const c of activeClients) {
          if (c.ws.readyState === WebSocket.OPEN && c.roomId === roomId) {
            c.ws.send(payload);
          }
        }
      }

      if (type === 'typing' && roomId) {
        const payload = JSON.stringify({
          type: 'typing',
          roomId,
          userId: client.userId,
          userName: client.userName,
          isTyping,
        });

        for (const c of activeClients) {
          if (c.ws !== ws && c.ws.readyState === WebSocket.OPEN && c.roomId === roomId) {
            c.ws.send(payload);
          }
        }
      }
    } catch (err) {
      console.error('Error handling WS message:', err);
    }
  });

  ws.on('close', () => {
    activeClients.delete(client);
  });
});

// Vite Middleware Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`LifeLink server listening on port ${port}`);
  });
}

startServer();
