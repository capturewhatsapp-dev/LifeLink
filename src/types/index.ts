export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STANDBY';

export type RequestStatus = 'PENDING' | 'IN_COORDINATION' | 'FULFILLED' | 'CANCELLED';

export interface BloodRequest {
  id: string;
  patientName: string; // Patient full name displayed for urgent needs
  patientCode: string;
  patientCondition: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  unitsFulfilled: number;
  urgency: UrgencyLevel;
  hospitalName: string;
  hospitalVerified: boolean;
  city: string;
  locality: string;
  coordinates: { lat: number; lng: number };
  contactPersonRole: string;
  contactPhone: string;
  requisitionSlipUrl?: string;
  status: RequestStatus;
  createdAt: string;
  pledgedDonorsCount: number;
  activeRoomId: string;
}

export interface DonorProfile {
  id: string;
  fullName: string; // Registered donor's name displayed in Find Donors
  maskedIdentifier: string; // Donor ID / tag e.g. "Donor #4089"
  bloodGroup: BloodGroup;
  city: string;
  locality: string;
  phone: string; // Contact phone for direct call & location requests
  travelRadiusKm: number;
  availability: 'AVAILABLE' | 'ON_CALL' | 'RECENTLY_DONATED' | 'PAUSED';
  lastDonationDate?: string;
  daysUntilEligible: number;
  donationsCount: number;
  verifiedBadge: boolean;
  registeredAt: string;
  isCurrentUser?: boolean;
}

export interface VerifiedOrganization {
  id: string;
  name: string;
  type: 'Blood Bank' | 'Diagnostic & Blood Centre' | 'Multispecialty Hospital' | 'Government Hospital' | 'Pharmacy & Blood Desk';
  licenseNumber: string;
  city: string;
  address: string;
  emergencyContact: string;
  operates24x7: boolean;
  currentStock: Record<BloodGroup, number>;
  lastStockAudit: string;
  verifiedBadge: boolean;
}

export interface AwarenessCampaignMedia {
  id: string;
  title: string;
  category: 'Infographic' | 'Social Poster' | 'Donor Guide' | 'Myths vs Facts';
  summary: string;
  keyTakeaways: string[];
  imageUrl: string;
  cloudinaryId: string;
  format: 'png' | 'webp' | 'jpg';
  tags: string[];
  shareCount: number;
  downloadSize: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: 'seeker' | 'donor' | 'hospital_rep' | 'system';
  text: string;
  timestamp: string;
  isSystemNotice?: boolean;
  actionType?: 'pledge' | 'arrived' | 'fulfilled' | 'verification' | 'location_request';
  locationDetails?: {
    hospitalName: string;
    address: string;
    city: string;
  };
}

export interface LocationRequestPayload {
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
}
