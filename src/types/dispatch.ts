export type EmergencyPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RequestStatus =
  | 'NEW'
  | 'PENDING'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'PATIENT_PICKED_UP'
  | 'HOSPITAL_TRANSPORT'
  | 'COMPLETED'
  | 'CANCELLED';

export type AmbulanceStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'AT_INCIDENT'
  | 'TRANSPORTING'
  | 'MAINTENANCE';

// Indian Ambulance Categories required by prompt:
// BLS (Basic Life Support), ALS (Advanced Life Support), PTA (Patient Transport Ambulance), NEONATAL (Neonatal Ambulance)
export type AmbulanceType = 'BLS' | 'ALS' | 'PTA' | 'NEONATAL';

// Indian Emergency Categories required by prompt:
export type EmergencyType =
  | 'Road Accident'
  | 'Cardiac Emergency'
  | 'Breathing Difficulty'
  | 'Stroke'
  | 'Pregnancy / Maternity'
  | 'Burns'
  | 'Trauma'
  | 'Unconscious Patient'
  | 'Other Medical Emergency';

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  stage: RequestStatus | 'STATUS_CHANGE';
  description: string;
  actor: string;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  callerName: string;
  contactNumber: string; // Indian mobile number e.g. +91 98765 43210
  emergencyType: EmergencyType;
  priority: EmergencyPriority;

  // Indian Address Fields
  location: string;
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  street?: string;
  landmark?: string;
  pincode?: string;

  latitude: number;
  longitude: number;
  requestTime: string;
  numberOfPatients: number;
  requiredAmbulanceType: AmbulanceType;
  status: RequestStatus;

  assignedAmbulanceId?: string;
  assignedAmbulanceNumber?: string; // Indian Registration e.g. BR 01 AM 2045, DL 01 EM 1024
  assignedDriver?: string;
  assignedCrew?: string[];
  destinationHospitalId?: string;
  destinationHospitalName?: string;
  notes?: string;
  triageNotes?: string;
  responseTimeMinutes?: number;
  arrivalMinutes?: number;
  tripDurationMinutes?: number;
  timeline: IncidentTimelineEvent[];
}

export interface Ambulance {
  id: string;
  vehicleNumber: string; // Indian RTO plate e.g. BR 01 AM 2045, DL 01 EM 1024, KA 05 EM 3321
  type: AmbulanceType;
  currentLocation: string;
  latitude: number;
  longitude: number;
  driverName: string;
  medicalCrew: string[];
  status: AmbulanceStatus;
  currentIncidentId?: string;
  lastUpdated: string;
  fuelLevel: number;
  equipmentRating: string;
  baseStation: string;
  heading?: number;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  erCapacity: 'OPEN' | 'BUSY' | 'CRITICAL';
  availableBeds: number;
  traumaLevel: string;
}

export interface ActiveTrip {
  id: string;
  incidentId: string;
  ambulanceId: string;
  driver: string;
  crew: string[];
  pickupLocation: string;
  destinationHospital: string;
  destinationLat?: number;
  destinationLng?: number;
  currentLocation: string;
  currentLat: number;
  currentLng: number;
  distanceRemainingKm: number;
  etaMinutes: number;
  status: RequestStatus;
  startTime: string;
  currentStageIndex: number;
  vitals?: {
    heartRate: number;
    bloodPressure: string;
    spO2: number;
    condition: string;
  };
}

export type EventType =
  | 'NEW_REQUEST'
  | 'AMBULANCE_ASSIGNED'
  | 'DEPARTED'
  | 'ARRIVED'
  | 'PATIENT_PICKED_UP'
  | 'HOSPITAL_TRANSPORT'
  | 'TRIP_COMPLETED'
  | 'AMBULANCE_AVAILABLE'
  | 'ALERT';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: EventType;
  message: string;
  incidentId?: string;
  ambulanceId?: string;
  priority?: EmergencyPriority;
}

export interface RecommendationScore {
  ambulance: Ambulance;
  distanceKm: number;
  etaMinutes: number;
  typeMatchScore: number;
  availabilityScore: number;
  overallScore: number;
  isRecommended: boolean;
  reasons: string[];
}

// Indian Mobile Number Validator (10 digits starting with 6,7,8,9, optional +91 prefix)
export function isValidIndianMobile(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}

// Indian Pincode Validator (6 digits, first digit 1-9)
export function isValidIndianPincode(pincode: string): boolean {
  if (!pincode) return false;
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}
