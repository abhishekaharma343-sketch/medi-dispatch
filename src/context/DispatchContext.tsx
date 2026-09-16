import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Ambulance,
  EmergencyRequest,
  Hospital,
  ActiveTrip,
  ActivityEvent,
  RequestStatus,
  AmbulanceStatus,
  EmergencyPriority,
  AmbulanceType,
  EmergencyType,
} from '../types/dispatch';
import {
  INITIAL_AMBULANCES,
  INITIAL_HOSPITALS,
  INITIAL_REQUESTS,
  INITIAL_TRIPS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/sampleData';
import { audioService } from '../services/audioService';
import { Language, translations, t as translateHelper, TranslationKey } from '../i18n/translations';

interface DispatchContextType {
  // Data state
  requests: EmergencyRequest[];
  ambulances: Ambulance[];
  trips: ActiveTrip[];
  hospitals: Hospital[];
  activityLogs: ActivityEvent[];
  soundEnabled: boolean;
  activeTab: string;
  language: Language;

  // Modals & workflows
  selectedIncidentForDispatch: EmergencyRequest | null;
  selectedIncidentForTimeline: EmergencyRequest | null;
  isNewIncidentModalOpen: boolean;
  isErssModalOpen: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  toggleSound: () => void;
  openDispatchModal: (incident: EmergencyRequest) => void;
  closeDispatchModal: () => void;
  openTimelineModal: (incident: EmergencyRequest) => void;
  closeTimelineModal: () => void;
  openNewIncidentModal: () => void;
  closeNewIncidentModal: () => void;
  openErssModal: () => void;
  closeErssModal: () => void;

  assignAmbulance: (incidentId: string, ambulanceId: string) => void;
  updateTripStage: (tripId: string, nextStage: RequestStatus) => void;
  advanceTripStep: (tripId: string) => void;
  createEmergencyRequest: (data: Partial<EmergencyRequest>) => EmergencyRequest;
  updateAmbulanceStatus: (ambulanceId: string, status: AmbulanceStatus) => void;

  // Demo simulator features
  simulateIncoming911Call: () => void;
  simulateSurge: () => void;
  resetToSampleData: () => void;

  // Derived KPI metrics
  stats: {
    totalRequests: number;
    criticalRequests: number;
    highRequests: number;
    pendingRequests: number;
    availableAmbulances: number;
    busyAmbulances: number;
    ambulancesEnRoute: number;
    transportingAmbulances: number;
    completedTripsCount: number;
    isResourceShortage: boolean;
    shortageMessage: string;
  };
}

const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'medi_dispatch_india_v1';

export const DispatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<EmergencyRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_req`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [ambulances, setAmbulances] = useState<Ambulance[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_amb`);
    return saved ? JSON.parse(saved) : INITIAL_AMBULANCES;
  });

  const [trips, setTrips] = useState<ActiveTrip[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_trips`);
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_lang`);
    return (saved as Language) || 'en';
  });

  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal states
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState<EmergencyRequest | null>(null);
  const [selectedIncidentForTimeline, setSelectedIncidentForTimeline] = useState<EmergencyRequest | null>(null);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState<boolean>(false);
  const [isErssModalOpen, setIsErssModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_req`, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_amb`, JSON.stringify(ambulances));
  }, [ambulances]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_trips`, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_logs`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_lang`, lang);
  };

  const t = useCallback(
    (key: TranslationKey, fallback?: string) => {
      return translateHelper(language, key, fallback);
    },
    [language]
  );

  const toggleSound = () => {
    const newState = audioService.toggleSound();
    setSoundEnabled(newState);
  };

  const addActivityLog = useCallback(
    (type: ActivityEvent['type'], message: string, incidentId?: string, ambulanceId?: string, priority?: EmergencyPriority) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newEvent: ActivityEvent = {
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: timeStr,
        type,
        message,
        incidentId,
        ambulanceId,
        priority,
      };
      setActivityLogs((prev) => [newEvent, ...prev.slice(0, 49)]);
    },
    []
  );

  const assignAmbulance = useCallback(
    (incidentId: string, ambulanceId: string) => {
      const targetIncident = requests.find((r) => r.id === incidentId);
      const targetAmbulance = ambulances.find((a) => a.id === ambulanceId);

      if (!targetIncident || !targetAmbulance) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update Ambulance
      setAmbulances((prev) =>
        prev.map((amb) =>
          amb.id === ambulanceId
            ? {
                ...amb,
                status: 'ASSIGNED',
                currentIncidentId: incidentId,
                lastUpdated: 'Just now',
              }
            : amb
        )
      );

      // Update Incident
      setRequests((prev) =>
        prev.map((req) =>
          req.id === incidentId
            ? {
                ...req,
                status: 'ASSIGNED',
                assignedAmbulanceId: ambulanceId,
                assignedAmbulanceNumber: targetAmbulance.vehicleNumber,
                assignedDriver: targetAmbulance.driverName,
                assignedCrew: targetAmbulance.medicalCrew,
                timeline: [
                  ...req.timeline,
                  {
                    id: `tl-${Date.now()}`,
                    time: timeStr,
                    stage: 'ASSIGNED',
                    description: `Ambulance ${ambulanceId} (${targetAmbulance.vehicleNumber}) assigned via National 112 CAD`,
                    actor: 'Dispatcher Priya Nair (Console 04)',
                  },
                ],
              }
            : req
        )
      );

      // Create or update Active Trip
      const newTrip: ActiveTrip = {
        id: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
        incidentId: incidentId,
        ambulanceId: ambulanceId,
        driver: targetAmbulance.driverName,
        crew: targetAmbulance.medicalCrew,
        pickupLocation: targetIncident.location,
        destinationHospital: targetIncident.destinationHospitalName || 'AIIMS Apex Emergency & Trauma Centre',
        destinationLat: targetIncident.destinationHospitalId === 'HOSP-03' ? 28.5672 : 25.5582,
        destinationLng: targetIncident.destinationHospitalId === 'HOSP-03' ? 77.21 : 85.0428,
        currentLocation: targetAmbulance.currentLocation,
        currentLat: targetAmbulance.latitude,
        currentLng: targetAmbulance.longitude,
        distanceRemainingKm: 2.4,
        etaMinutes: 6,
        status: 'ASSIGNED',
        startTime: timeStr,
        currentStageIndex: 1,
        vitals: {
          heartRate: 88,
          bloodPressure: '126/82',
          spO2: 97,
          condition: 'Patient stabilized, awaiting unit on-scene triage',
        },
      };

      setTrips((prev) => [newTrip, ...prev.filter((t) => t.incidentId !== incidentId)]);

      addActivityLog(
        'AMBULANCE_ASSIGNED',
        `Ambulance ${ambulanceId} (${targetAmbulance.vehicleNumber}) assigned to Incident ${incidentId} (${targetIncident.emergencyType})`,
        incidentId,
        ambulanceId,
        targetIncident.priority
      );

      audioService.playDispatchConfirm();
      setSelectedIncidentForDispatch(null);
    },
    [requests, ambulances, addActivityLog]
  );

  const updateTripStage = useCallback(
    (tripId: string, nextStage: RequestStatus) => {
      const targetTrip = trips.find((t) => t.id === tripId);
      if (!targetTrip) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const stages: RequestStatus[] = [
        'PENDING',
        'ASSIGNED',
        'EN_ROUTE',
        'ARRIVED',
        'PATIENT_PICKED_UP',
        'HOSPITAL_TRANSPORT',
        'COMPLETED',
      ];
      const stageIdx = stages.indexOf(nextStage);

      let ambStatus: AmbulanceStatus = 'ASSIGNED';
      if (nextStage === 'EN_ROUTE') ambStatus = 'EN_ROUTE';
      else if (nextStage === 'ARRIVED') ambStatus = 'AT_INCIDENT';
      else if (nextStage === 'PATIENT_PICKED_UP' || nextStage === 'HOSPITAL_TRANSPORT')
        ambStatus = 'TRANSPORTING';
      else if (nextStage === 'COMPLETED') ambStatus = 'AVAILABLE';

      setAmbulances((prev) =>
        prev.map((amb) =>
          amb.id === targetTrip.ambulanceId
            ? {
                ...amb,
                status: ambStatus,
                currentIncidentId: nextStage === 'COMPLETED' ? undefined : targetTrip.incidentId,
                lastUpdated: 'Just now',
              }
            : amb
        )
      );

      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== targetTrip.incidentId) return req;

          let desc = `Status updated to ${nextStage}`;
          if (nextStage === 'EN_ROUTE') desc = `Ambulance ${targetTrip.ambulanceId} departed depot en route with sirens`;
          else if (nextStage === 'ARRIVED') desc = `Ambulance arrived at location in ${req.city || 'scene'}`;
          else if (nextStage === 'PATIENT_PICKED_UP') desc = `Patient stabilized and onboarded into ambulance`;
          else if (nextStage === 'HOSPITAL_TRANSPORT') desc = `In transit to ${targetTrip.destinationHospital}`;
          else if (nextStage === 'COMPLETED') desc = `Patient handed over to ER emergency trauma staff. Unit cleared for service.`;

          return {
            ...req,
            status: nextStage,
            tripDurationMinutes: nextStage === 'COMPLETED' ? 26 : req.tripDurationMinutes,
            responseTimeMinutes: nextStage === 'ARRIVED' ? 7.1 : req.responseTimeMinutes,
            timeline: [
              ...req.timeline,
              {
                id: `tl-${Date.now()}`,
                time: timeStr,
                stage: nextStage,
                description: desc,
                actor: `Crew of ${targetTrip.ambulanceId}`,
              },
            ],
          };
        })
      );

      if (nextStage === 'COMPLETED') {
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
        addActivityLog(
          'TRIP_COMPLETED',
          `Trip ${tripId} completed for Incident ${targetTrip.incidentId}. Ambulance ${targetTrip.ambulanceId} back in service.`,
          targetTrip.incidentId,
          targetTrip.ambulanceId
        );
        addActivityLog(
          'AMBULANCE_AVAILABLE',
          `Ambulance ${targetTrip.ambulanceId} sanitized and marked AVAILABLE in fleet`,
          undefined,
          targetTrip.ambulanceId
        );
        audioService.playStepCompletion();
      } else {
        setTrips((prev) =>
          prev.map((t) =>
            t.id === tripId
              ? {
                  ...t,
                  status: nextStage,
                  currentStageIndex: stageIdx >= 0 ? stageIdx : t.currentStageIndex + 1,
                  distanceRemainingKm: Math.max(0, +(t.distanceRemainingKm * 0.6).toFixed(1)),
                  etaMinutes: Math.max(1, Math.round(t.etaMinutes * 0.6)),
                }
              : t
          )
        );

        let eventType: ActivityEvent['type'] = 'DEPARTED';
        if (nextStage === 'ARRIVED') eventType = 'ARRIVED';
        else if (nextStage === 'PATIENT_PICKED_UP') eventType = 'PATIENT_PICKED_UP';
        else if (nextStage === 'HOSPITAL_TRANSPORT') eventType = 'HOSPITAL_TRANSPORT';

        addActivityLog(
          eventType,
          `Ambulance ${targetTrip.ambulanceId} moved to ${nextStage} for Incident ${targetTrip.incidentId}`,
          targetTrip.incidentId,
          targetTrip.ambulanceId
        );
        audioService.playStepCompletion();
      }
    },
    [trips, addActivityLog]
  );

  const advanceTripStep = useCallback(
    (tripId: string) => {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) return;

      const stages: RequestStatus[] = [
        'ASSIGNED',
        'EN_ROUTE',
        'ARRIVED',
        'PATIENT_PICKED_UP',
        'HOSPITAL_TRANSPORT',
        'COMPLETED',
      ];
      const currentIdx = stages.indexOf(trip.status);
      if (currentIdx >= 0 && currentIdx < stages.length - 1) {
        updateTripStage(tripId, stages[currentIdx + 1]);
      }
    },
    [trips, updateTripStage]
  );

  const createEmergencyRequest = useCallback(
    (data: Partial<EmergencyRequest>): EmergencyRequest => {
      const idNum = Math.floor(2050 + Math.random() * 500);
      const newId = `INC-${idNum}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newRequest: EmergencyRequest = {
        id: newId,
        patientName: data.patientName || 'Unidentified Citizen',
        callerName: data.callerName || '112 ERSS Caller',
        contactNumber: data.contactNumber || '+91 98765 43210',
        emergencyType: data.emergencyType || 'Road Accident',
        priority: data.priority || 'HIGH',
        location: data.location || 'Old Bypass Road, Kankarbagh, Patna, Bihar - 800020',
        state: data.state || 'Bihar',
        district: data.district || 'Patna',
        city: data.city || 'Patna',
        area: data.area || 'Kankarbagh',
        street: data.street || 'Main Bypass Road',
        landmark: data.landmark || 'Near Tiwary Bechar',
        pincode: data.pincode || '800020',
        latitude: data.latitude || 25.5941 + (Math.random() - 0.5) * 0.02,
        longitude: data.longitude || 85.158 + (Math.random() - 0.5) * 0.02,
        requestTime: timeStr,
        numberOfPatients: data.numberOfPatients || 1,
        requiredAmbulanceType: data.requiredAmbulanceType || 'ALS',
        status: 'PENDING',
        notes: data.notes || 'Emergency call ingested via 112 ERSS National Gateway.',
        triageNotes: data.triageNotes || 'Priority dispatch order initialized.',
        destinationHospitalId: 'HOSP-01',
        destinationHospitalName: 'AIIMS Patna Apex Emergency & Trauma Centre',
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: timeStr,
            stage: 'NEW',
            description: `112 Emergency Call Ingested: ${data.emergencyType || 'Road Accident'} in ${data.city || 'Patna'}`,
            actor: 'National 112 ERSS Gateway',
          },
          {
            id: `tl-${Date.now() + 1}`,
            time: timeStr,
            stage: 'PENDING',
            description: `Triage complete. Awaiting dispatch of nearest unit. Acuity: ${data.priority || 'HIGH'}`,
            actor: 'Automated Dispatch Core',
          },
        ],
      };

      setRequests((prev) => [newRequest, ...prev]);

      addActivityLog(
        'NEW_REQUEST',
        `112 ${newRequest.priority} Alert: ${newRequest.id} (${newRequest.emergencyType}) at ${newRequest.location}`,
        newRequest.id,
        undefined,
        newRequest.priority
      );

      if (newRequest.priority === 'CRITICAL' || newRequest.priority === 'HIGH') {
        audioService.playCriticalAlert();
      }

      setIsNewIncidentModalOpen(false);
      return newRequest;
    },
    [addActivityLog]
  );

  const updateAmbulanceStatus = useCallback((ambulanceId: string, status: AmbulanceStatus) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === ambulanceId ? { ...a, status, lastUpdated: 'Just now' } : a))
    );
  }, []);

  // Demo simulator for Indian realistic emergency calls
  const simulateIncoming911Call = useCallback(() => {
    const indianTemplates: Array<{
      patient: string;
      caller: string;
      phone: string;
      type: EmergencyType;
      priority: EmergencyPriority;
      loc: string;
      state: string;
      district: string;
      city: string;
      area: string;
      street: string;
      landmark: string;
      pincode: string;
      lat: number;
      lng: number;
      ambType: AmbulanceType;
      notes: string;
    }> = [
      {
        patient: 'Ravi Kant Singh (Age 45)',
        caller: 'Sunil Prasad (Eyewitness)',
        phone: '+91 98350 44921',
        type: 'Road Accident',
        priority: 'CRITICAL',
        loc: 'Old Bypass Road, Kankarbagh, Near Tiwary Bechar, Patna, Bihar - 800020',
        state: 'Bihar',
        district: 'Patna',
        city: 'Patna',
        area: 'Kankarbagh',
        street: 'Old Bypass Road',
        landmark: 'Near Tiwary Bechar Showroom',
        pincode: '800020',
        lat: 25.5941,
        lng: 85.158,
        ambType: 'ALS',
        notes: 'Two-wheeler and auto-rickshaw collision. Multiple fractures and deep lacerations.',
      },
      {
        patient: 'Birender Nath (Age 62)',
        caller: 'Rekha Nath (Daughter)',
        phone: '+91 98110 55823',
        type: 'Cardiac Emergency',
        priority: 'CRITICAL',
        loc: 'Ring Road, Near AIIMS Metro Gate 3, New Delhi - 110029',
        state: 'Delhi',
        district: 'South Delhi',
        city: 'New Delhi',
        area: 'Safdarjung Enclave',
        street: 'Ring Road',
        landmark: 'Near AIIMS Metro Gate 3',
        pincode: '110029',
        lat: 28.5672,
        lng: 77.21,
        ambType: 'ALS',
        notes: 'Sudden collapse with chest tightness radiating to left arm. High risk of STEMI.',
      },
      {
        patient: 'Lakshmi Narayana (Age 29)',
        caller: 'Harish Gowda (Neighbor)',
        phone: '+91 98450 12899',
        type: 'Pregnancy / Maternity',
        priority: 'HIGH',
        loc: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        city: 'Bengaluru',
        area: 'Indiranagar',
        street: '100 Feet Road',
        landmark: 'Near BDA Complex',
        pincode: '560038',
        lat: 12.9719,
        lng: 77.6412,
        ambType: 'ALS',
        notes: 'Full term pregnancy, acute labor pains, water broken. Needs immediate transfer.',
      },
      {
        patient: 'Dattatray Shinde (Age 68)',
        caller: 'Dr. Vivek Shinde',
        phone: '+91 98200 99412',
        type: 'Stroke',
        priority: 'CRITICAL',
        loc: 'Dr. Ambedkar Road, Parel, Near KEM Hospital, Mumbai, Maharashtra - 400012',
        state: 'Maharashtra',
        district: 'Mumbai City',
        city: 'Mumbai',
        area: 'Parel',
        street: 'Dr. Ambedkar Road',
        landmark: 'Opposite Parel Post Office',
        pincode: '400012',
        lat: 19.0033,
        lng: 72.8423,
        ambType: 'ALS',
        notes: 'FAST positive: right-sided weakness, severe slurred speech, onset within 25 minutes.',
      },
      {
        patient: 'Alok Kumar (Age 35)',
        caller: 'Security Staff Manoj',
        phone: '+91 99350 77102',
        type: 'Trauma',
        priority: 'HIGH',
        loc: 'Vibhuti Khand, Gomti Nagar, Near Wave Mall, Lucknow, Uttar Pradesh - 226010',
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        city: 'Lucknow',
        area: 'Gomti Nagar',
        street: 'Vibhuti Khand Road',
        landmark: 'Near Wave Mall Roundabout',
        pincode: '226010',
        lat: 26.865,
        lng: 81.002,
        ambType: 'BLS',
        notes: 'Fall from construction scaffolding with compound leg fracture and bleed.',
      },
    ];

    const pick = indianTemplates[Math.floor(Math.random() * indianTemplates.length)];
    createEmergencyRequest({
      patientName: pick.patient,
      callerName: pick.caller,
      contactNumber: pick.phone,
      emergencyType: pick.type,
      priority: pick.priority,
      location: pick.loc,
      state: pick.state,
      district: pick.district,
      city: pick.city,
      area: pick.area,
      street: pick.street,
      landmark: pick.landmark,
      pincode: pick.pincode,
      latitude: pick.lat,
      longitude: pick.lng,
      requiredAmbulanceType: pick.ambType,
      notes: pick.notes,
    });
  }, [createEmergencyRequest]);

  const simulateSurge = useCallback(() => {
    simulateIncoming911Call();
    setTimeout(() => simulateIncoming911Call(), 400);
    setTimeout(() => simulateIncoming911Call(), 800);
  }, [simulateIncoming911Call]);

  const resetToSampleData = useCallback(() => {
    setRequests(INITIAL_REQUESTS);
    setAmbulances(INITIAL_AMBULANCES);
    setTrips(INITIAL_TRIPS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_req`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_amb`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_trips`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_logs`);
    addActivityLog('ALERT', 'System data restored to initial Indian control-room state');
  }, [addActivityLog]);

  // Derived KPI metrics
  const totalRequests = requests.length;
  const criticalRequests = requests.filter((r) => r.priority === 'CRITICAL' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;
  const highRequests = requests.filter((r) => r.priority === 'HIGH' && r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;
  const pendingRequests = requests.filter((r) => r.status === 'PENDING' || r.status === 'NEW').length;
  const availableAmbulances = ambulances.filter((a) => a.status === 'AVAILABLE').length;
  const busyAmbulances = ambulances.filter((a) => a.status !== 'AVAILABLE' && a.status !== 'MAINTENANCE').length;
  const ambulancesEnRoute = ambulances.filter((a) => a.status === 'EN_ROUTE').length;
  const transportingAmbulances = ambulances.filter((a) => a.status === 'TRANSPORTING').length;
  const completedTripsCount = requests.filter((r) => r.status === 'COMPLETED').length;

  const isResourceShortage = criticalRequests > availableAmbulances;
  const shortageMessage = isResourceShortage
    ? `${criticalRequests} critical incidents waiting — ${availableAmbulances} ambulance available`
    : '';

  return (
    <DispatchContext.Provider
      value={{
        requests,
        ambulances,
        trips,
        hospitals,
        activityLogs,
        soundEnabled,
        activeTab,
        language,
        selectedIncidentForDispatch,
        selectedIncidentForTimeline,
        isNewIncidentModalOpen,
        isErssModalOpen,
        setActiveTab,
        setLanguage,
        t,
        toggleSound,
        openDispatchModal: setSelectedIncidentForDispatch,
        closeDispatchModal: () => setSelectedIncidentForDispatch(null),
        openTimelineModal: setSelectedIncidentForTimeline,
        closeTimelineModal: () => setSelectedIncidentForTimeline(null),
        openNewIncidentModal: () => setIsNewIncidentModalOpen(true),
        closeNewIncidentModal: () => setIsNewIncidentModalOpen(false),
        openErssModal: () => setIsErssModalOpen(true),
        closeErssModal: () => setIsErssModalOpen(false),
        assignAmbulance,
        updateTripStage,
        advanceTripStep,
        createEmergencyRequest,
        updateAmbulanceStatus,
        simulateIncoming911Call,
        simulateSurge,
        resetToSampleData,
        stats: {
          totalRequests,
          criticalRequests,
          highRequests,
          pendingRequests,
          availableAmbulances,
          busyAmbulances,
          ambulancesEnRoute,
          transportingAmbulances,
          completedTripsCount,
          isResourceShortage,
          shortageMessage,
        },
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatchContext = () => {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error('useDispatchContext must be used within a DispatchProvider');
  }
  return context;
};
