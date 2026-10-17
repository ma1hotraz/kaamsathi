'use client';

import React, { useState, useEffect } from 'react';
import { GrievanceInput, GrievanceDraft, IssueCategory, ShiftEntry, Language } from '@/lib/types';
import { generateGrievanceDraft } from '@/lib/grievance';
import { UI_TEXT } from '@/lib/i18n';
import { FileText, Copy, Check, AlertTriangle, Send, RefreshCw } from 'lucide-react';

interface GrievanceDrafterProps {
  initialShift?: ShiftEntry | null;
  currentLang: Language;
}

export const GrievanceDrafter: React.FC<GrievanceDrafterProps> = ({ initialShift, currentLang }) => {
  const t = UI_TEXT[currentLang];

  const [platform, setPlatform] = useState<string>('Zomato');
  const [workerName, setWorkerName] = useState<string>('');
  const [workerId, setWorkerId] = useState<string>('');
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('penalty_dispute');
  const [dateOfIncident, setDateOfIncident] = useState<string>('2026-10-17');
  const [expectedAmount, setExpectedAmount] = useState<string>('');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [tripOrOrderId, setTripOrOrderId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [desiredOutcome, setDesiredOutcome] = useState<string>('');

  const [draft, setDraft] = useState<GrievanceDraft | null>(null);
  const [activeTab, setActiveTab] = useState<'formal' | 'chat'>('formal');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialShift) {
      setPlatform(initialShift.platform);
      setDateOfIncident(initialShift.date);
      setExpectedAmount(initialShift.grossEarnings.toString());
      if (initialShift.notes) {
        setDescription(`Note from recorded shift: ${initialShift.notes}`);
      }
    }
  }, [initialShift]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    const input: GrievanceInput = {
      platform,
      workerName: workerName.trim() || undefined,
      workerId: workerId.trim() || undefined,
      issueCategory,
      dateOfIncident,
      expectedAmount: expectedAmount ? parseFloat(expectedAmount) : null,
      receivedAmount: receivedAmount ? parseFloat(receivedAmount) : null,
      tripOrOrderId: tripOrOrderId.trim() || undefined,
      description,
      desiredOutcome: desiredOutcome.trim() || undefined,
      language: currentLang,
    };

    const result = generateGrievanceDraft(input);
    setDraft(result);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Form Input Column */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="h-4 w-4 text-amber-400" />
            <span>Dispute & Grievance Form</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strictly preserves your real facts. Never invents claims or fake evidence.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform / Company</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Zomato">Zomato</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Uber">Uber</option>
                <option value="Ola">Ola</option>
                <option value="Zepto">Zepto</option>
                <option value="Blinkit">Blinkit</option>
                <option value="Urban Company">Urban Company</option>
                <option value="Contractor / Daily Wage">Contractor / Daily Wage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Category</label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="penalty_dispute">Wrong Penalty / Fine</option>
                <option value="delayed_payout">Delayed Payout</option>
                <option value="distance_mismatch">Distance / Fare Mismatch</option>
                <option value="app_glitch">App Glitch / Missing Shift</option>
                <option value="deactivation">Account Deactivation Appeal</option>
                <option value="harassment">Safety / Dispute</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name (Optional)</label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Partner / ID No. (Optional)</label>
              <input
                type="text"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                placeholder="e.g. ZOM-84210"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Incident</label>
              <input
                type="date"
                required
                value={dateOfIncident}
                onChange={(e) => setDateOfIncident(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Order / Trip ID (Optional)</label>
              <input
                type="text"
                value={tripOrOrderId}
                onChange={(e) => setTripOrOrderId(e.target.value)}
                placeholder="e.g. ORD-10924"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={expectedAmount}
                onChange={(e) => setExpectedAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Actual Received (₹)</label>
              <input
                type="number"
                step="0.01"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">What Happened? (Factual Description)</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State exactly what occurred (e.g. Restaurant order was delayed by 35 mins due to rain, yet a ₹150 late delivery penalty was deducted)."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Desired Resolution</label>
            <input
              type="text"
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="e.g. Full refund of ₹150 penalty and score restoration"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center space-x-1.5"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Verified Dispute Draft</span>
          </button>
        </form>
      </div>

      {/* Output Column */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('formal')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'formal'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Formal Letter / Email
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                In-App Chat / Ticket
              </button>
            </div>

            {draft && (
              <button
                type="button"
                onClick={() => handleCopy(activeTab === 'formal' ? draft.formalLetter : draft.inAppChatVersion)}
                className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? t.actions.copied : t.actions.copy}</span>
              </button>
            )}
          </div>

          {/* Placeholders Banner */}
          {draft && draft.placeholdersFound.length > 0 && (
            <div className="my-3 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Missing Information Noted:</span>
                <p className="text-amber-200/80 mt-0.5">
                  The draft contains bracketed placeholders like <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-300 font-mono">[NEEDED: ...]</code> for missing details. Please fill these in before sending.
                </p>
              </div>
            </div>
          )}

          {/* Draft text display */}
          <div className="mt-3">
            {draft ? (
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap max-h-[450px] overflow-y-auto selection:bg-amber-500 selection:text-slate-950">
                {activeTab === 'formal' ? draft.formalLetter : draft.inAppChatVersion}
              </pre>
            ) : (
              <div className="h-72 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <FileText className="h-8 w-8 text-slate-600" />
                <p className="text-xs text-slate-400 font-medium">
                  Fill in your dispute details on the left and click &ldquo;Generate Verified Dispute Draft&rdquo;.
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Missing information will be marked with clear placeholders so you stay in 100% control of your communication.
                </p>
              </div>
            )}
          </div>
        </div>

        {draft && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Generated locally • Adheres strictly to user facts</span>
            <span>{draft.placeholdersFound.length} placeholders marked</span>
          </div>
        )}
      </div>
    </div>
  );
};
