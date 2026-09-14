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

interface DispatchContextType {
  // Data state
  requests: EmergencyRequest[];
  ambulances: Ambulance[];
  trips: ActiveTrip[];
  hospitals: Hospital[];
  activityLogs: ActivityEvent[];
  soundEnabled: boolean;
  activeTab: string;

  // Modals & workflows
  selectedIncidentForDispatch: EmergencyRequest | null;
  selectedIncidentForTimeline: EmergencyRequest | null;
  isNewIncidentModalOpen: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  toggleSound: () => void;
  openDispatchModal: (incident: EmergencyRequest) => void;
  closeDispatchModal: () => void;
  openTimelineModal: (incident: EmergencyRequest) => void;
  closeTimelineModal: () => void;
  openNewIncidentModal: () => void;
  closeNewIncidentModal: () => void;

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

const LOCAL_STORAGE_KEY = 'medi_dispatch_state_v1';

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

  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal states
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState<EmergencyRequest | null>(null);
  const [selectedIncidentForTimeline, setSelectedIncidentForTimeline] = useState<EmergencyRequest | null>(null);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState<boolean>(false);

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
      setActivityLogs((prev) => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 logs
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
                    description: `Ambulance ${ambulanceId} (${targetAmbulance.vehicleNumber}) assigned to incident`,
                    actor: 'Dispatcher Console 04',
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
        destinationHospital: targetIncident.destinationHospitalName || 'Metro Central Level-1 Trauma Hospital',
        destinationLat: 40.7642,
        destinationLng: -73.956,
        currentLocation: targetAmbulance.currentLocation,
        currentLat: targetAmbulance.latitude,
        currentLng: targetAmbulance.longitude,
        distanceRemainingKm: 2.1,
        etaMinutes: 5,
        status: 'ASSIGNED',
        startTime: timeStr,
        currentStageIndex: 1, // 0: Received, 1: Assigned, 2: En Route, 3: Arrived, 4: Picked Up, 5: Hospital Transport, 6: Completed
        vitals: {
          heartRate: 88,
          bloodPressure: '124/80',
          spO2: 98,
          condition: 'Patient awaiting arrival of EMS unit',
        },
      };

      setTrips((prev) => [newTrip, ...prev.filter((t) => t.incidentId !== incidentId)]);

      // Log activity
      addActivityLog(
        'AMBULANCE_ASSIGNED',
        `Ambulance ${ambulanceId} assigned to Incident ${incidentId} (${targetIncident.emergencyType})`,
        incidentId,
        ambulanceId,
        targetIncident.priority
      );

      // Play dispatch sound
      audioService.playDispatchConfirm();

      // Close modal
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

      // Determine stage index
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

      // Determine corresponding ambulance status
      let ambStatus: AmbulanceStatus = 'ASSIGNED';
      if (nextStage === 'EN_ROUTE') ambStatus = 'EN_ROUTE';
      else if (nextStage === 'ARRIVED') ambStatus = 'AT_INCIDENT';
      else if (nextStage === 'PATIENT_PICKED_UP' || nextStage === 'HOSPITAL_TRANSPORT')
        ambStatus = 'TRANSPORTING';
      else if (nextStage === 'COMPLETED') ambStatus = 'AVAILABLE';

      // Update Ambulance
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

      // Update Incident
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== targetTrip.incidentId) return req;

          let desc = `Status updated to ${nextStage}`;
          if (nextStage === 'EN_ROUTE') desc = `Ambulance ${targetTrip.ambulanceId} departed station en route`;
          else if (nextStage === 'ARRIVED') desc = `Ambulance ${targetTrip.ambulanceId} arrived at scene`;
          else if (nextStage === 'PATIENT_PICKED_UP') desc = `Patient stabilized & loaded into unit`;
          else if (nextStage === 'HOSPITAL_TRANSPORT') desc = `Transporting to ${targetTrip.destinationHospital}`;
          else if (nextStage === 'COMPLETED') desc = `Patient handed over to emergency department. Unit back in service.`;

          return {
            ...req,
            status: nextStage,
            tripDurationMinutes: nextStage === 'COMPLETED' ? 24 : req.tripDurationMinutes,
            responseTimeMinutes: nextStage === 'ARRIVED' ? 6.8 : req.responseTimeMinutes,
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

      // Update Trip
      if (nextStage === 'COMPLETED') {
        // Remove from active trips
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
        addActivityLog(
          'TRIP_COMPLETED',
          `Trip ${tripId} completed for Incident ${targetTrip.incidentId}. Ambulance ${targetTrip.ambulanceId} is now AVAILABLE.`,
          targetTrip.incidentId,
          targetTrip.ambulanceId
        );
        addActivityLog(
          'AMBULANCE_AVAILABLE',
          `Ambulance ${targetTrip.ambulanceId} cleared hospital and returned to service`,
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
          `Ambulance ${targetTrip.ambulanceId} transitioned to ${nextStage} for Incident ${targetTrip.incidentId}`,
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
        patientName: data.patientName || 'Unidentified Patient',
        callerName: data.callerName || 'Anonymous 911 Caller',
        contactNumber: data.contactNumber || '+1 (555) 911-0000',
        emergencyType: data.emergencyType || 'Medical Emergency',
        priority: data.priority || 'HIGH',
        location: data.location || 'Times Square Broadway & 44th',
        latitude: data.latitude || 40.757 + (Math.random() - 0.5) * 0.03,
        longitude: data.longitude || -73.985 + (Math.random() - 0.5) * 0.03,
        requestTime: timeStr,
        numberOfPatients: data.numberOfPatients || 1,
        requiredAmbulanceType: data.requiredAmbulanceType || 'ALS',
        status: 'PENDING',
        notes: data.notes || 'Emergency dispatch call placed via CAD interface.',
        triageNotes: data.triageNotes || 'Priority dispatch order initialized.',
        destinationHospitalId: 'HOSP-01',
        destinationHospitalName: 'Metro Central Level-1 Trauma Hospital',
        timeline: [
          {
            id: `tl-${Date.now()}`,
            time: timeStr,
            stage: 'NEW',
            description: `911 Emergency call logged: ${data.emergencyType || 'Medical Emergency'}`,
            actor: 'CAD Emergency Ingestion',
          },
          {
            id: `tl-${Date.now() + 1}`,
            time: timeStr,
            stage: 'PENDING',
            description: `Triage complete. Awaiting unit dispatch with priority ${data.priority || 'HIGH'}`,
            actor: 'Automated Dispatch Core',
          },
        ],
      };

      setRequests((prev) => [newRequest, ...prev]);

      addActivityLog(
        'NEW_REQUEST',
        `New ${newRequest.priority} Request: ${newRequest.id} (${newRequest.emergencyType}) at ${newRequest.location}`,
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

  // Demo simulator functions
  const simulateIncoming911Call = useCallback(() => {
    const templates: Array<{
      patient: string;
      caller: string;
      phone: string;
      type: EmergencyType;
      priority: EmergencyPriority;
      loc: string;
      lat: number;
      lng: number;
      ambType: AmbulanceType;
      notes: string;
    }> = [
      {
        patient: 'Robert Henderson (Age 61)',
        caller: 'Hotel Security - Grand Central',
        phone: '+1 (555) 301-4492',
        type: 'Cardiac Emergency',
        priority: 'CRITICAL',
        loc: '89 E 42nd St, Grand Central Terminal',
        lat: 40.7527,
        lng: -73.9772,
        ambType: 'ALS',
        notes: 'Sudden collapse in terminal concourse. Bystander CPR initiated. AED on site.',
      },
      {
        patient: 'Highway Pileup (3 Vehicles)',
        caller: 'Highway Patrol Car 18',
        phone: '+1 (555) 911-8844',
        type: 'Major Accident',
        priority: 'CRITICAL',
        loc: 'FDR Drive Northbound at 34th Exit',
        lat: 40.7424,
        lng: -73.9715,
        ambType: 'ALS',
        notes: 'Multi-vehicle collision with entrapment and severe structural cabin damage.',
      },
      {
        patient: 'Sophia Ramirez (Age 19)',
        caller: 'Friend Alicia',
        phone: '+1 (555) 782-9011',
        type: 'Severe Trauma',
        priority: 'HIGH',
        loc: 'High Line Park near 23rd St access',
        lat: 40.7485,
        lng: -74.0048,
        ambType: 'ALS',
        notes: 'Fall from elevated platform with severe cranial laceration and unconsciousness.',
      },
      {
        patient: 'Arthur Pendelton (Age 77)',
        caller: 'Home Care Nurse Nancy',
        phone: '+1 (555) 442-1877',
        type: 'Stroke Alert',
        priority: 'CRITICAL',
        loc: '320 Central Park West, Apt 8C',
        lat: 40.7895,
        lng: -73.9688,
        ambType: 'MICU',
        notes: 'Sudden facial droop and right arm paralysis starting 20 minutes ago.',
      },
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];
    createEmergencyRequest({
      patientName: pick.patient,
      callerName: pick.caller,
      contactNumber: pick.phone,
      emergencyType: pick.type,
      priority: pick.priority,
      location: pick.loc,
      latitude: pick.lat,
      longitude: pick.lng,
      requiredAmbulanceType: pick.ambType,
      notes: pick.notes,
    });
  }, [createEmergencyRequest]);

  const simulateSurge = useCallback(() => {
    // Spawns 3 critical incidents simultaneously
    simulateIncoming911Call();
    setTimeout(() => {
      simulateIncoming911Call();
    }, 400);
    setTimeout(() => {
      simulateIncoming911Call();
    }, 800);
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
    addActivityLog('ALERT', 'System data restored to initial control-room state');
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
        selectedIncidentForDispatch,
        selectedIncidentForTimeline,
        isNewIncidentModalOpen,
        setActiveTab,
        toggleSound,
        openDispatchModal: setSelectedIncidentForDispatch,
        closeDispatchModal: () => setSelectedIncidentForDispatch(null),
        openTimelineModal: setSelectedIncidentForTimeline,
        closeTimelineModal: () => setSelectedIncidentForTimeline(null),
        openNewIncidentModal: () => setIsNewIncidentModalOpen(true),
        closeNewIncidentModal: () => setIsNewIncidentModalOpen(false),
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
