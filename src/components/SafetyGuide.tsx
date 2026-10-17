'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { OFFICIAL_EMERGENCY_CONTACTS, SAFETY_PROTOCOLS } from '@/lib/safety';
import { PhoneCall, ShieldAlert, Sun, Car, Moon, HardHat, AlertTriangle, ExternalLink } from 'lucide-react';

interface SafetyGuideProps {
  currentLang: Language;
}

export const SafetyGuide: React.FC<SafetyGuideProps> = ({ currentLang }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'heatwave':
        return <Sun className="h-5 w-5 text-amber-400" />;
      case 'accident':
        return <Car className="h-5 w-5 text-rose-400" />;
      case 'delivery':
        return <Moon className="h-5 w-5 text-sky-400" />;
      case 'site':
        return <HardHat className="h-5 w-5 text-yellow-400" />;
      default:
        return <ShieldAlert className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Helpline Banner */}
      <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-2.5 text-rose-300 mb-3">
          <PhoneCall className="h-5 w-5 text-rose-400 animate-pulse" />
          <h2 className="text-base font-bold text-white">Emergency Helplines (Direct Click-to-Call)</h2>
        </div>
        <p className="text-xs text-rose-200/90 mb-4">
          Disclaimer: KaamSaathi guidance is for educational reference. In any life-threatening road collision, violence, or medical crisis, immediately call 112 or local emergency services.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICIAL_EMERGENCY_CONTACTS.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="bg-slate-900/90 border border-rose-500/30 hover:border-rose-400 rounded-xl p-3.5 flex items-center justify-between group transition-all"
            >
              <div>
                <span className="text-xs text-slate-300 font-medium block">{item.service}</span>
                <span className="text-lg font-black text-white group-hover:text-rose-400 transition-colors">
                  {item.number}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{item.description}</span>
              </div>
              <PhoneCall className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      </div>

      {/* Practical Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAFETY_PROTOCOLS.map((protocol) => {
          const title = protocol.title[currentLang] || protocol.title.en;

          return (
            <div
              key={protocol.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                    {getIcon(protocol.category)}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">{title}</h3>
                </div>

                <ul className="mt-3.5 space-y-2 text-xs text-slate-300 leading-relaxed">
                  {protocol.steps.map((step, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 text-[11px] text-amber-300/90 flex items-start space-x-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{protocol.warning}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
