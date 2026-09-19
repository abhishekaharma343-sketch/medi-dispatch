import React, { useState } from 'react';
import {
  HeartPulse,
  Phone,
  X,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  Wind,
  Heart,
  Droplets,
  UserRound,
  Brain,
  Activity,
} from 'lucide-react';

const emergencyOptions = [
  {
    name: 'Breathing Problem',
    icon: Wind,
    description: 'Difficulty breathing or shortness of breath',
  },
  {
    name: 'Chest Pain',
    icon: Heart,
    description: 'Chest discomfort or possible cardiac emergency',
  },
  {
    name: 'Heavy Bleeding',
    icon: Droplets,
    description: 'Severe bleeding from an injury',
  },
  {
    name: 'Unconscious Patient',
    icon: UserRound,
    description: 'Patient is unresponsive',
  },
  {
    name: 'Possible Stroke',
    icon: Brain,
    description: 'Sudden weakness, speech or facial changes',
  },
  {
    name: 'Seizure',
    icon: Activity,
    description: 'Patient is having or has had a seizure',
  },
];

const guidance: Record<string, string[]> = {
  'Breathing Problem': [
    'Keep the patient calm and stay with them.',
    'Help the patient sit comfortably if they are awake.',
    'Loosen tight clothing around the neck and chest.',
    'If they have a prescribed inhaler, help them use it as directed.',
    'If breathing becomes severely worse, call 112 immediately.',
  ],

  'Chest Pain': [
    'Stop physical activity and let the patient rest.',
    'Keep the patient calm and in a comfortable position.',
    'Do not give food or drink if the patient may become unconscious.',
    'Do not delay emergency medical care.',
    'If the patient becomes unresponsive and is not breathing normally, call 112.',
  ],

  'Heavy Bleeding': [
    'Make sure the area is safe before helping.',
    'Use a clean cloth or dressing if available.',
    'Apply firm, continuous pressure directly over the bleeding.',
    'Do not repeatedly remove the cloth to check the wound.',
    'Keep pressure on the wound until medical help arrives.',
  ],

  'Unconscious Patient': [
    'Check if the patient responds when you speak to them.',
    'Check whether the patient is breathing normally.',
    'If they are not breathing normally, call 112 immediately.',
    'Follow the emergency dispatcher instructions.',
    'Stay with the patient and monitor their breathing until help arrives.',
  ],

  'Possible Stroke': [
    'Ask the patient to smile and check for facial weakness.',
    'Ask the patient to raise both arms if possible.',
    'Ask them to speak a simple sentence and listen for speech difficulty.',
    'Note the time when the symptoms first started.',
    'Tell the emergency team about the symptoms and their start time.',
  ],

  Seizure: [
    'Move dangerous objects away from the patient.',
    'Protect the patient from injury but do not hold them down.',
    'Do not put anything inside the patient’s mouth.',
    'Do not give food or drink during the seizure.',
    'Stay with the patient and monitor their breathing.',
  ],
};

export const MediAssistAI: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [step, setStep] = useState(0);

  const steps = selected ? guidance[selected] : [];

  const closeAssistant = () => {
    setOpen(false);
    setSelected('');
    setStep(0);
  };

  const call112 = () => {
    window.location.href = 'tel:112';
  };

  const selectEmergency = (name: string) => {
    setSelected(name);
    setStep(0);
  };

  return (
    <>
      {/* FLOATING AI BUTTON */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open MEDI-Assist AI"
          className="fixed bottom-6 right-6 z-[90] group"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />

          <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-300/50 bg-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.45)] transition-all duration-200 group-hover:scale-110 group-hover:bg-emerald-500">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-emerald-700/70">
              <HeartPulse className="h-6 w-6 text-white" />
            </span>

            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-950 bg-white text-[13px] font-black text-emerald-600">
              +
            </span>
          </span>

          <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg border border-emerald-500/20 bg-slate-950 px-3 py-2 text-[11px] font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            MEDI-Assist AI
          </span>
        </button>
      )}

      {/* AI PANEL */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end bg-black/70 p-0 sm:p-5">
          <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950 shadow-2xl sm:h-[min(760px,calc(100vh-40px))] sm:max-w-xl sm:rounded-2xl sm:border sm:border-slate-700">

            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-900/30">
                  <HeartPulse className="h-6 w-6 text-white" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">
                      MEDI-Assist AI
                    </h2>

                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                      READY
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500">
                    Emergency guidance while help is arriving
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAssistant}
                aria-label="Close MEDI-Assist AI"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 112 BAR */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-red-500/20 bg-red-950/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />

                <p className="text-[11px] font-medium text-red-200">
                  Serious emergency? Call 112 immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={call112}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500 active:scale-95"
              >
                <Phone className="h-4 w-4" />
                112
              </button>
            </div>

            {/* CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">

              {/* EMERGENCY SELECTION */}
              {!selected && (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white">
                      How can MEDI-Assist help?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Select what is happening to the patient for basic
                      emergency guidance.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {emergencyOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => selectEmergency(option.name)}
                          className="group rounded-xl border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-emerald-500/40 hover:bg-slate-800 active:scale-[0.98]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500/20">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-white">
                                {option.name}
                              </p>

                              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                {option.description}
                              </p>
                            </div>

                            <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-emerald-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-[10px] leading-4 text-slate-500">
                      MEDI-Assist provides basic first-response guidance only.
                      It does not replace emergency medical professionals.
                    </p>
                  </div>
                </>
              )}

              {/* GUIDANCE */}
              {selected && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected('');
                      setStep(0);
                    }}
                    className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Choose another emergency
                  </button>

                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/15">
                        <HeartPulse className="h-6 w-6 text-emerald-400" />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                          Emergency guidance
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-white">
                          {selected}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Step {step + 1} of {steps.length}
                      </span>

                      <div className="flex gap-1">
                        {steps.map((_, index) => (
                          <span
                            key={index}
                            className={`h-1.5 w-6 rounded-full ${
                              index <= step
                                ? 'bg-emerald-500'
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-7 min-h-[130px]">
                      <p className="text-lg font-medium leading-8 text-slate-100">
                        {steps[step]}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={step === 0}
                        onClick={() => setStep(step - 1)}
                        className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ← Back
                      </button>

                      {step < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500 active:scale-95"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelected('');
                            setStep(0);
                          }}
                          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500 active:scale-95"
                        >
                          Finish
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="shrink-0 border-t border-slate-800 bg-slate-950 px-4 py-3 text-center">
              <p className="text-[9px] leading-4 text-slate-600">
                Basic emergency guidance only • Not a medical diagnosis
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};