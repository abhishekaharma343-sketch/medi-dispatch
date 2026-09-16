export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Branding & Header
    appTitle: 'MEDI-Dispatch India',
    tagline: 'Faster Response. Smarter Dispatch. Saving Lives.',
    emergency112: 'Emergency? Call 112',
    emergency112Sub: "India's Unified Emergency Response",
    localTime: 'LOCAL TIME (IST)',
    utcTime: 'UTC TIME',
    online: 'ONLINE',
    simulate911: 'Simulate 112 Call',
    surgeTest: 'Surge Test',
    createIncident: 'Log Emergency',
    resetData: 'Reset Data',
    operator: 'Operator',
    shift: 'Shift A • National ERSS Node',

    // Navigation
    dashboard: 'Dashboard',
    emergencyRequests: 'Emergency Requests',
    ambulances: 'Ambulance Fleet',
    liveMap: 'Live CAD Map',
    activeTrips: 'Active Trips',
    incidentHistory: 'Incident History',
    reports: 'Reports & Analytics',
    dispatchNav: 'DISPATCH NAVIGATION',
    fleetReadiness: 'Fleet Readiness',
    avail: 'Avail',
    enRoute: 'En Route',
    atHosp: 'At Hospital',
    units: 'Units',

    // Priorities
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',

    // Statuses
    newStatus: 'NEW',
    pending: 'PENDING DISPATCH',
    assigned: 'ASSIGNED',
    enRouteStatus: 'EN ROUTE',
    arrived: 'ARRIVED AT SCENE',
    patientPickedUp: 'PATIENT PICKED UP',
    hospitalTransport: 'HOSPITAL TRANSPORT',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
    available: 'AVAILABLE',
    maintenance: 'MAINTENANCE / OFFLINE',

    // Ambulance Tiers
    bls: 'BLS — Basic Life Support',
    als: 'ALS — Advanced Life Support',
    pta: 'PTA — Patient Transport Ambulance',
    neonatal: 'Neonatal Ambulance',

    // Common Actions
    dispatchAmbulance: 'Dispatch Ambulance',
    dispatchNow: 'Dispatch Now',
    assignAmbulance: 'Assign Ambulance',
    confirmAssignment: 'Confirm & Dispatch',
    markEnRoute: 'Mark En Route',
    markArrived: 'Mark Arrived',
    patientOnBoard: 'Patient Picked Up',
    transportToER: 'Hospital Transport',
    completeTrip: 'Complete Trip',
    viewTimeline: 'Audit Timeline',
    cancel: 'Cancel',
    exportCSV: 'Export CSV',
    searchPlaceholder: 'Search by Incident ID, Patient, City, Pincode...',

    // Indian Address Form
    state: 'State',
    district: 'District',
    city: 'City',
    area: 'Area / Locality',
    street: 'Street / Road',
    landmark: 'Landmark',
    pincode: 'Pincode (6 digits)',
    gpsCoords: 'GPS Coordinates',
    contactNumber: 'Contact Number (+91)',
    patientName: 'Patient Name',
    callerName: 'Caller Name',
    emergencyCategory: 'Emergency Category',
    requiredTier: 'Required Ambulance Tier',
    patientsCount: 'Number of Patients',
    triageNotes: 'Triage / Clinical Notes',

    // Dashboard Cards
    totalRequests: 'Total Emergency Requests',
    criticalRequests: 'Critical Requests',
    pendingRequests: 'Pending Requests',
    availableAmbulances: 'Available Ambulances',
    busyAmbulances: 'Busy / On Mission',
    ambulancesEnRoute: 'Ambulances En Route',
    completedTrips: 'Completed Trips',
    shortageAlert: 'CRITICAL FLEET SHORTAGE',
    immediateTriageRequired: 'Immediate multi-agency triage required. Call regional mutual aid.',
  },
  hi: {
    // Branding & Header
    appTitle: 'मेडी-डिस्पैच इंडिया',
    tagline: 'तेज़ प्रतिक्रिया। स्मार्ट प्रेषण। जीवन रक्षा।',
    emergency112: 'आपातकाल? डायल 112',
    emergency112Sub: 'भारत की एकीकृत आपातकालीन प्रतिक्रिया प्रणाली',
    localTime: 'स्थानीय समय (IST)',
    utcTime: 'यूटीसी समय',
    online: 'सक्रिय',
    simulate911: '112 कॉल सिमुलेट करें',
    surgeTest: 'मास सर्ज टेस्ट',
    createIncident: 'आपातकाल दर्ज करें',
    resetData: 'डेटा रीसेट',
    operator: 'ऑपरेटर',
    shift: 'शिफ्ट ए • राष्ट्रीय ERSS नोड',

    // Navigation
    dashboard: 'डैशबोर्ड',
    emergencyRequests: 'आपातकालीन अनुरोध',
    ambulances: 'एम्बुलेंस बेड़ा',
    liveMap: 'लाइव सीएडी मैप',
    activeTrips: 'सक्रिय यात्राएं',
    incidentHistory: 'घटना इतिहास',
    reports: 'रिपोर्ट और विश्लेषण',
    dispatchNav: 'डिस्पैच नेविगेशन',
    fleetReadiness: 'बेड़ा तत्परता',
    avail: 'उपलब्ध',
    enRoute: 'मार्ग में',
    atHosp: 'अस्पताल में',
    units: 'इकाइयां',

    // Priorities
    critical: 'अति-गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कम',

    // Statuses
    newStatus: 'नया',
    pending: 'प्रेषण लंबित',
    assigned: 'आवंटित',
    enRouteStatus: 'मार्ग में',
    arrived: 'घटनास्थल पर पहुंचे',
    patientPickedUp: 'मरीज को लिया गया',
    hospitalTransport: 'अस्पताल परिवहन',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    available: 'उपलब्ध',
    maintenance: 'रखरखाव / ऑफ़लाइन',

    // Ambulance Tiers
    bls: 'बीएलएस — बेसिक लाइफ सपोर्ट',
    als: 'एएलएस — एडवांस्ड लाइफ सपोर्ट',
    pta: 'पीटीए — मरीज परिवहन एम्बुलेंस',
    neonatal: 'नवजात शिशु गहन चिकित्सा एम्बुलेंस',

    // Common Actions
    dispatchAmbulance: 'एम्बुलेंस भेजें',
    dispatchNow: 'तुरंत भेजें',
    assignAmbulance: 'एम्बुलेंस आवंटित करें',
    confirmAssignment: 'पुष्टि करें और भेजें',
    markEnRoute: 'मार्ग में चिह्नित करें',
    markArrived: 'पहुंच दर्ज करें',
    patientOnBoard: 'मरीज सवार हुआ',
    transportToER: 'अस्पताल ले जाएं',
    completeTrip: 'यात्रा पूर्ण करें',
    viewTimeline: 'घटना टाइमलाइन देखें',
    cancel: 'रद्द करें',
    exportCSV: 'सीएसवी निर्यात',
    searchPlaceholder: 'घटना आईडी, मरीज, शहर, पिनकोड से खोजें...',

    // Indian Address Form
    state: 'राज्य',
    district: 'जिला',
    city: 'शहर',
    area: 'क्षेत्र / इलाका',
    street: 'सड़क / मार्ग',
    landmark: 'सीमाचिह्न (Landmark)',
    pincode: 'पिनकोड (6 अंक)',
    gpsCoords: 'जीपीएस निर्देशांक',
    contactNumber: 'संपर्क नंबर (+91)',
    patientName: 'मरीज का नाम',
    callerName: 'कॉलर का नाम',
    emergencyCategory: 'आपातकाल श्रेणी',
    requiredTier: 'आवश्यक एम्बुलेंस प्रकार',
    patientsCount: 'मरीजों की संख्या',
    triageNotes: 'क्लिनिकल / ट्राइएज नोट्स',

    // Dashboard Cards
    totalRequests: 'कुल आपातकालीन अनुरोध',
    criticalRequests: 'अति-गंभीर अनुरोध',
    pendingRequests: 'लंबित अनुरोध',
    availableAmbulances: 'उपलब्ध एम्बुलेंस',
    busyAmbulances: 'कार्यरत / मिशन पर',
    ambulancesEnRoute: 'मार्ग में एम्बुलेंस',
    completedTrips: 'पूर्ण यात्राएं',
    shortageAlert: 'गंभीर एम्बुलेंस कमी चेतावनी',
    immediateTriageRequired: 'तत्काल ट्राइएज आवश्यक। क्षेत्रीय सहायता संपर्क करें।',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey, fallback?: string): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || fallback || translations.en[key] || key;
}
