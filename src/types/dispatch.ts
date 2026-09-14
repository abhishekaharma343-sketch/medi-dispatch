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

export type AmbulanceType = 'ALS' | 'BLS' | 'MICU' | 'NEONATAL';

export type EmergencyType =
  | 'Cardiac Emergency'
  | 'Major Accident'
  | 'Severe Trauma'
  | 'Breathing Difficulty'
  | 'Stroke Alert'
  | 'Severe Injury'
  | 'Fall / Fracture'
  | 'Medical Emergency'
  | 'Pediatric Emergency'
  | 'Obstetric / Maternity';

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
  contactNumber: string;
  emergencyType: EmergencyType;
  priority: EmergencyPriority;
  location: string;
  latitude: number;
  longitude: number;
  requestTime: string;
  numberOfPatients: number;
  requiredAmbulanceType: AmbulanceType;
  status: RequestStatus;
  assignedAmbulanceId?: string;
  assignedAmbulanceNumber?: string;
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
  vehicleNumber: string;
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
