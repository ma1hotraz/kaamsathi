'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/types';
import { FileSearch, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

interface DocumentHelperProps {
  currentLang: Language;
}

export const DocumentHelper: React.FC<DocumentHelperProps> = ({ currentLang }) => {
  const [docText, setDocText] = useState<string>('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const prompt = `
Please analyze the following document text or notice provided by a gig worker in India:

"""
${docText.trim().slice(0, 3000)}
"""

Please provide:
1. Simple Plain-Language Summary (in ${currentLang === 'hi' ? 'Hindi' : currentLang === 'hinglish' ? 'Hinglish' : 'English'}): What does this text actually mean for the worker?
2. Red Flags / Tricky Clauses: Are there hidden deductions, penalties, or unfair waivers?
3. Step-by-Step Next Actions: What concrete steps should the worker take right now?

CRITICAL: Analyze ONLY what the user provided above. Do not claim to read unsupplied documents or files.
`.trim();

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          language: currentLang,
          category: 'document',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze document.');
      }

      setExplanation(data.reply);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error analyzing document text.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Column */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileSearch className="h-4 w-4 text-amber-400" />
            <span>Document & Notice Simplifier</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste confusing contract clauses, penalty deduction notices, or insurance claim letters.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-start space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Privacy Safeguard:</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Please remove personal Aadhaar numbers, PAN, or bank passwords before pasting. Only supplied text is reviewed.
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Paste Document Text or Contract Terms:
            </label>
            <textarea
              required
              rows={8}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="e.g. 'Clause 4.2: Delivery partner acknowledges that late delivery exceeding 15 minutes shall attract a liquidated penalty of ₹200 deductible from the weekly settlement...'"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !docText.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center space-x-1.5"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Simplifying Terms with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Explain in Plain Language</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Output Column */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>Plain Language Explanation & Checklist</span>
            </h3>
            {explanation && (
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Verified
              </span>
            )}
          </div>

          {error && (
            <div className="my-3 bg-rose-950/80 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-200 flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300">Analysis Error</span>
                <p className="mt-0.5 text-[11px]">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-3">
            {explanation ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto">
                {explanation}
              </div>
            ) : (
              <div className="h-64 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <FileSearch className="h-8 w-8 text-slate-600" />
                <p className="text-xs text-slate-400 font-medium">
                  Paste any notice, penalty slip, or clause on the left to receive a clear explanation.
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  We translate legal terms into simple daily language and prepare your actionable next steps.
                </p>
              </div>
            )}
          </div>
        </div>

        {explanation && (
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Analysis strictly limited to supplied text</span>
          </div>
        )}
      </div>
    </div>
  );
};
