'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { VERIFIED_WELFARE_SCHEMES } from '@/lib/schemes';
import { Shield, ExternalLink, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

interface SchemeAwarenessProps {
  currentLang: Language;
}

export const SchemeAwareness: React.FC<SchemeAwarenessProps> = ({ currentLang }) => {
  return (
    <div className="space-y-6">
      {/* Honesty Banner */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start space-x-2.5">
        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Verified Welfare Schemes & Uncertainty Notice:</span>
          <p className="mt-0.5 leading-relaxed">
            All schemes listed below are official Government of India welfare frameworks. We do not invent rules or guarantee approvals.
            Eligibility criteria, state-level welfare fund allocations, and documentary requirements vary across states. Always confirm your status directly at the verified official portal or your local CSC Jan Seva Kendra.
          </p>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VERIFIED_WELFARE_SCHEMES.map((scheme) => {
          const name = scheme.name[currentLang] || scheme.name.en;

          return (
            <div
              key={scheme.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white">{name}</h3>
                      <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full capitalize">
                        {scheme.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400">Target Group:</span>
                  <p className="text-xs text-slate-200 mt-0.5">{scheme.targetGroup}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400">Key Verified Entitlements:</span>
                  <ul className="mt-1 space-y-1.5 text-xs text-slate-300">
                    {scheme.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400">Documents Needed:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {scheme.documentsNeeded.map((doc, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="text-[11px] text-amber-300/80 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  {scheme.uncertaintyDisclaimer}
                </div>

                <a
                  href={scheme.officialPortal.startsWith('http') ? scheme.officialPortal.split(' ')[0] : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Verify at Official Portal</span>
                  <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
