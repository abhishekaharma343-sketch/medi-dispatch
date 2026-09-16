import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  MapPin,
  User,
  Phone,
  Ambulance,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import {
  EmergencyPriority,
  EmergencyType,
  AmbulanceType,
  isValidIndianMobile,
  isValidIndianPincode,
} from '../../types/dispatch';
import { useDispatchContext } from '../../context/DispatchContext';

interface CityPreset {
  name: string;
  state: string;
  district: string;
  city: string;
  area: string;
  street: string;
  landmark: string;
  pincode: string;
  lat: number;
  lng: number;
}

const INDIAN_PRESETS: CityPreset[] = [
  {
    name: 'Patna (Kankarbagh)',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    area: 'Kankarbagh',
    street: 'Old Bypass Road',
    landmark: 'Near Tiwary Bechar Showroom',
    pincode: '800020',
    lat: 25.5941,
    lng: 85.158,
  },
  {
    name: 'New Delhi (AIIMS)',
    state: 'Delhi',
    district: 'South Delhi',
    city: 'New Delhi',
    area: 'Safdarjung Enclave',
    street: 'Ring Road',
    landmark: 'Near AIIMS Metro Gate 3',
    pincode: '110029',
    lat: 28.5672,
    lng: 77.21,
  },
  {
    name: 'Bengaluru (Indiranagar)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    area: 'Indiranagar',
    street: '100 Feet Road',
    landmark: 'Opposite Metro Pillar 84',
    pincode: '560038',
    lat: 12.9719,
    lng: 77.6412,
  },
  {
    name: 'Mumbai (Parel)',
    state: 'Maharashtra',
    district: 'Mumbai City',
    city: 'Mumbai',
    area: 'Parel',
    street: 'Dr. Ambedkar Road',
    landmark: 'Near KEM Hospital Gate 2',
    pincode: '400012',
    lat: 19.0033,
    lng: 72.8423,
  },
  {
    name: 'Lucknow (Gomti Nagar)',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    city: 'Lucknow',
    area: 'Gomti Nagar',
    street: 'Vibhuti Khand Road',
    landmark: 'Near Wave Mall Roundabout',
    pincode: '226010',
    lat: 26.865,
    lng: 81.002,
  },
  {
    name: 'Kolkata (Park Circus)',
    state: 'West Bengal',
    district: 'Kolkata',
    city: 'Kolkata',
    area: 'Park Circus',
    street: 'Suhrwardy Avenue',
    landmark: 'Near 7-Point Crossing',
    pincode: '700017',
    lat: 22.542,
    lng: 88.368,
  },
];

export const NewIncidentModal: React.FC = () => {
  const {
    isNewIncidentModalOpen,
    closeNewIncidentModal,
    createEmergencyRequest,
    openDispatchModal,
    language,
    t,
  } = useDispatchContext();

  const isHindi = language === 'hi';

  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Road Accident');
  const [priority, setPriority] = useState<EmergencyPriority>('CRITICAL');
  const [patientName, setPatientName] = useState('Rajesh Sharma (Age 45)');
  const [callerName, setCallerName] = useState('Amit Verma');
  const [contactNumber, setContactNumber] = useState('+91 98765 43210');

  // Indian Address Fields
  const [stateName, setStateName] = useState('Bihar');
  const [district, setDistrict] = useState('Patna');
  const [city, setCity] = useState('Patna');
  const [area, setArea] = useState('Kankarbagh');
  const [street, setStreet] = useState('Old Bypass Road');
  const [landmark, setLandmark] = useState('Near Tiwary Bechar Showroom');
  const [pincode, setPincode] = useState('800020');
  const [latitude, setLatitude] = useState(25.5941);
  const [longitude, setLongitude] = useState(85.158);

  const [numberOfPatients, setNumberOfPatients] = useState(1);
  const [requiredAmbulanceType, setRequiredAmbulanceType] = useState<AmbulanceType>('ALS');
  const [notes, setNotes] = useState('Severe vehicular collision with head trauma and lower limb injury.');
  const [immediateDispatch, setImmediateDispatch] = useState(true);

  // Validation state
  const [phoneError, setPhoneError] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  if (!isNewIncidentModalOpen) return null;

  const applyPreset = (preset: CityPreset) => {
    setStateName(preset.state);
    setDistrict(preset.district);
    setCity(preset.city);
    setArea(preset.area);
    setStreet(preset.street);
    setLandmark(preset.landmark);
    setPincode(preset.pincode);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    if (!isValidIndianMobile(contactNumber)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (+91 98765 43210)');
      return;
    } else {
      setPhoneError('');
    }

    // Validate pincode
    if (!isValidIndianPincode(pincode)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code (e.g. 800020)');
      return;
    } else {
      setPincodeError('');
    }

    const fullLocation = `${street}, ${area}, ${landmark}, ${city}, ${stateName} - ${pincode}`;

    const created = createEmergencyRequest({
      patientName,
      callerName,
      contactNumber,
      emergencyType,
      priority,
      location: fullLocation,
      state: stateName,
      district,
      city,
      area,
      street,
      landmark,
      pincode,
      latitude,
      longitude,
      numberOfPatients,
      requiredAmbulanceType,
      notes,
    });

    if (immediateDispatch) {
      openDispatchModal(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {isHindi ? '112 आपातकालीन कॉल दर्ज करें (CAD Ingestion)' : 'Log New 112 Emergency Incident (CAD Ingestion)'}
              </h2>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? 'भारतीय पते, पिनकोड और संपर्क सत्यापन के साथ त्वरित प्रेषण'
                  : 'Emergency intake with Indian address verification and 112 dispatch routing'}
              </p>
            </div>
          </div>

          <button
            onClick={closeNewIncidentModal}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Preset Quick Fill Bar */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-amber-400 font-bold flex items-center space-x-1 mr-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? 'त्वरित भारतीय शहर:' : 'Indian City Presets:'}</span>
            </span>
            {INDIAN_PRESETS.map((p) => (
              <button
                type="button"
                key={p.name}
                onClick={() => applyPreset(p)}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono cursor-pointer transition"
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Emergency Category & Acuity Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('emergencyCategory')} *
              </label>
              <select
                value={emergencyType}
                onChange={(e) => {
                  const val = e.target.value as EmergencyType;
                  setEmergencyType(val);
                  if (val === 'Road Accident' || val === 'Cardiac Emergency' || val === 'Stroke') {
                    setPriority('CRITICAL');
                    setRequiredAmbulanceType('ALS');
                  } else if (val === 'Pregnancy / Maternity') {
                    setPriority('HIGH');
                    setRequiredAmbulanceType('ALS');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Road Accident">Road Accident (सड़क दुर्घटना)</option>
                <option value="Cardiac Emergency">Cardiac Emergency (हृदय आपातकाल)</option>
                <option value="Breathing Difficulty">Breathing Difficulty (सांस लेने में तकलीफ)</option>
                <option value="Stroke">Stroke (स्ट्रोक / पक्षाघात)</option>
                <option value="Pregnancy / Maternity">Pregnancy / Maternity (प्रसव / मातृत्व)</option>
                <option value="Burns">Burns (जलने की चोट)</option>
                <option value="Trauma">Trauma (गंभीर आघात / फ्रैक्चर)</option>
                <option value="Unconscious Patient">Unconscious Patient (बेहोश मरीज)</option>
                <option value="Other Medical Emergency">Other Medical Emergency (अन्य आपातकाल)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('priority')} *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as EmergencyPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        isSelected
                          ? p === 'CRITICAL'
                            ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                            : p === 'HIGH'
                            ? 'bg-orange-600 text-white border-orange-500'
                            : p === 'MEDIUM'
                            ? 'bg-yellow-600 text-white border-yellow-500'
                            : 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {p === 'CRITICAL' ? '🔴' : p === 'HIGH' ? '🟠' : p === 'MEDIUM' ? '🟡' : '🟢'}{' '}
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Caller & Contact Number (+91) with Validation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('patientName')} *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Suresh Kumar (Male, 45)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('callerName')}
              </label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                placeholder="112 Caller Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('contactNumber')} *
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (phoneError) setPhoneError('');
                }}
                placeholder="+91 98765 43210"
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none ${
                  phoneError ? 'border-red-500' : 'border-slate-700 focus:border-red-500'
                }`}
                required
              />
              {phoneError && <span className="text-[10px] text-red-400 mt-0.5 block">{phoneError}</span>}
            </div>
          </div>

          {/* Indian Address Form Fields Required by Prompt:
              State, District, City, Area / Locality, Street / Road, Landmark, Pincode, GPS Location */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isHindi ? 'विस्तृत भारतीय पता व स्थान' : 'Structured Indian Incident Location'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('state')} *
                </label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="Bihar">Bihar (बिहार)</option>
                  <option value="Delhi">Delhi (दिल्ली)</option>
                  <option value="Karnataka">Karnataka (कर्नाटक)</option>
                  <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                  <option value="West Bengal">West Bengal (पश्चिम बंगाल)</option>
                  <option value="Telangana">Telangana (तेलंगाना)</option>
                  <option value="Tamil Nadu">Tamil Nadu (तमिलनाडु)</option>
                  <option value="Gujarat">Gujarat (गुजरात)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('district')}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('city')} *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Patna, New Delhi"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('area')} *
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Kankarbagh, Indiranagar, Parel"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('street')}
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Old Bypass Road, 100ft Road"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('landmark')} *
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Tiwary Bechar, Opposite Metro Gate"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('pincode')} *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    if (pincodeError) setPincodeError('');
                  }}
                  placeholder="e.g. 800020, 110029"
                  className={`w-full bg-slate-900 border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none ${
                    pincodeError ? 'border-red-500' : 'border-slate-700 focus:border-red-500'
                  }`}
                  required
                />
                {pincodeError && <span className="text-[10px] text-red-400 mt-0.5 block">{pincodeError}</span>}
              </div>
            </div>

            {/* GPS Latitude / Longitude */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                <span className="text-slate-400">LAT:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="bg-transparent text-white font-mono w-full focus:outline-none text-xs"
                />
              </div>
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                <span className="text-slate-400">LNG:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="bg-transparent text-white font-mono w-full focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Ambulance Tier (BLS, ALS, PTA, NEONATAL) & Victims */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('requiredTier')}
              </label>
              <select
                value={requiredAmbulanceType}
                onChange={(e) => setRequiredAmbulanceType(e.target.value as AmbulanceType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="ALS">ALS — Advanced Life Support (एडवांस्ड लाइफ सपोर्ट)</option>
                <option value="BLS">BLS — Basic Life Support (बेसिक लाइफ सपोर्ट)</option>
                <option value="PTA">PTA — Patient Transport Ambulance (मरीज परिवहन)</option>
                <option value="NEONATAL">Neonatal Ambulance (नवजात शिशु गहन चिकित्सा)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('patientsCount')}
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={numberOfPatients}
                onChange={(e) => setNumberOfPatients(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Triage Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('triageNotes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical symptoms, trauma details, highway landmarks..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="immediateDispatchIndia"
              checked={immediateDispatch}
              onChange={(e) => setImmediateDispatch(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-red-600 cursor-pointer"
            />
            <label htmlFor="immediateDispatchIndia" className="text-xs text-slate-300 cursor-pointer select-none">
              Open <span className="text-red-400 font-bold">112 Smart Dispatch Engine</span> immediately after logging
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeNewIncidentModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-950/50 cursor-pointer flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isHindi ? '112 घटना दर्ज करें' : 'Log 112 Incident'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
