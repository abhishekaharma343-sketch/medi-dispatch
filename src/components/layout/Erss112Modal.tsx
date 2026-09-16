import React from 'react';
import {
  X,
  PhoneCall,
  Shield,
  Radio,
  Flame,
  Ambulance,
  HeartPulse,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';

interface Erss112ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Erss112Modal: React.FC<Erss112ModalProps> = ({ isOpen, onClose }) => {
  const { simulateIncoming911Call, language } = useDispatchContext();

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleSimulate = () => {
    simulateIncoming911Call();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-red-950 via-slate-950 to-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold text-white">
                  {isHindi ? '112 भारत एकीकृत आपातकालीन प्रतिक्रिया' : '112 ERSS — Emergency Response India'}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  NATIONAL CAD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isHindi
                  ? 'भारत का एकीकृत एकल आपातकालीन नंबर (पुलिस, दमकल, एम्बुलेंस 108/102)'
                  : "India's Pan-India Unified Single Number for Citizens in Distress"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main Info Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>{isHindi ? '112 क्या है?' : 'What is Emergency 112 (ERSS)?'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {isHindi
                ? '112 भारत का राष्ट्रीय आपातकालीन प्रतिक्रिया सहायता तंत्र (Emergency Response Support System) है। यह पूर्व के अलग-अलग आपातकालीन नंबरों (पुलिस 100, दमकल 101, और एम्बुलेंस 108/102) को एक आधुनिक, जीपीएस-सक्षम एकीकृत नियंत्रण कक्ष में जोड़ता है।'
                : "112 is India's National Emergency Response Support System (ERSS). It unifies previously separate emergency hotlines — Police (100), Fire (101), Ambulance (108/102), and Disaster Management — under a single GPS-enabled Computer Aided Dispatch (CAD) infrastructure."}
            </p>
          </div>

          {/* Integrated Services Grid */}
          <div>
            <span className="text-slate-400 font-mono font-bold uppercase tracking-wider block mb-2 text-[11px]">
              {isHindi ? 'एकीकृत आपातकालीन सेवाएं' : 'Integrated Emergency Response Network'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                <HeartPulse className="w-5 h-5 text-red-400 mx-auto" />
                <span className="font-bold text-white block">108 / 102</span>
                <span className="text-[10px] text-slate-400 block">Ambulance & Maternity</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                <Shield className="w-5 h-5 text-blue-400 mx-auto" />
                <span className="font-bold text-white block">100</span>
                <span className="text-[10px] text-slate-400 block">Police Rapid Response</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                <Flame className="w-5 h-5 text-orange-400 mx-auto" />
                <span className="font-bold text-white block">101</span>
                <span className="text-[10px] text-slate-400 block">Fire & Rescue Services</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center space-y-1">
                <Radio className="w-5 h-5 text-teal-400 mx-auto" />
                <span className="font-bold text-white block">1033 / 1073</span>
                <span className="text-[10px] text-slate-400 block">Highway Trauma Aid</span>
              </div>
            </div>
          </div>

          {/* How MEDI-Dispatch Works in India */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-200 font-bold text-xs block">
              {isHindi ? 'मेडी-डिस्पैच इंडिया कैसे कार्य करता है?' : 'How MEDI-Dispatch Integrates with 112 CAD'}
            </span>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Unified Ingestion:</strong> 112 calls are automatically categorized into Road Accidents, Cardiac Arrests, Trauma, and Maternity emergencies.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Nearest Tier Allocation:</strong> Recommends nearest Basic Life Support (BLS), Advanced Life Support (ALS), or Neonatal unit based on Indian PIN codes and GPS radius.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Live Hospital Telemetry:</strong> Seamless handover to AIIMS, PMCH, KEM, and regional trauma emergency departments.
                </span>
              </li>
            </ul>
          </div>

          {/* Simulation Action Button */}
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">
                {isHindi ? 'डेमो: 112 कॉल अनुकरण करें' : 'Prototype Action: Ingest Simulated 112 Call'}
              </span>
              <span className="text-[11px] text-red-300">
                {isHindi
                  ? 'सिस्टम में एक वास्तविक भारतीय आपातकालीन घटना दर्ज करें'
                  : 'Injects a realistic Indian emergency call into the priority CAD queue'}
              </span>
            </div>

            <button
              onClick={handleSimulate}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg font-bold text-xs shadow cursor-pointer transition active:scale-95 flex items-center space-x-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isHindi ? '112 कॉल बनाएं' : 'Simulate 112 Call'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Official emergency helpline: Dial <strong>112</strong> anywhere in India.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
