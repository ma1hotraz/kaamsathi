'use client';

import React, { useState, useEffect } from 'react';
import { ShiftEntry, Language, EarningsSummary } from '@/lib/types';
import { calculateEarningsSummary } from '@/lib/calculations';
import { Header } from '@/components/Header';
import { EarningsTracker } from '@/components/EarningsTracker';
import { AiCompanion } from '@/components/AiCompanion';
import { SafetyGuide } from '@/components/SafetyGuide';
import { SchemeAwareness } from '@/components/SchemeAwareness';
import { DocumentHelper } from '@/components/DocumentHelper';
import { GrievanceDrafter } from '@/components/GrievanceDrafter';
import { JuryModal } from '@/components/JuryModal';
import { UI_TEXT } from '@/lib/i18n';

const LOCAL_STORAGE_KEY = 'kaamsaathi_shifts_v1';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('earnings');
  const [shifts, setShifts] = useState<ShiftEntry[]>([]);
  const [selectedShiftForGrievance, setSelectedShiftForGrievance] = useState<ShiftEntry | null>(null);

  // Jury authentication state
  const [jurySession, setJurySession] = useState<{
    authenticated: boolean;
    isConfigured: boolean;
    user?: string | null;
  }>({
    authenticated: false,
    isConfigured: false,
    user: null,
  });
  const [isJuryModalOpen, setIsJuryModalOpen] = useState<boolean>(false);

  // Load shifts safely from localStorage on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setShifts(parsed);
        }
      }
    } catch {
      // Safe fallback if local storage is disabled
    }
  }, []);

  // Save shifts to localStorage
  const saveShifts = (newShifts: ShiftEntry[]) => {
    setShifts(newShifts);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newShifts));
    } catch {
      // Ignore write errors
    }
  };

  // Check jury session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        setJurySession({
          authenticated: Boolean(data.authenticated),
          isConfigured: Boolean(data.isConfigured),
          user: data.user || null,
        });
      })
      .catch(() => {});
  }, []);

  const handleLogoutJury = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setJurySession((prev) => ({ ...prev, authenticated: false, user: null }));
    } catch {}
  };

  const handleAddShift = (shiftData: Omit<ShiftEntry, 'id' | 'createdAt'>) => {
    const newEntry: ShiftEntry = {
      ...shiftData,
      id: 'shift_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: Date.now(),
    };
    const updated = [newEntry, ...shifts];
    saveShifts(updated);
    return { success: true };
  };

  const handleDeleteShift = (id: string) => {
    const updated = shifts.filter((s) => s.id !== id);
    saveShifts(updated);
  };

  const handleSelectForGrievance = (shift: ShiftEntry) => {
    setSelectedShiftForGrievance(shift);
    setActiveTab('grievance');
  };

  // Authoritative deterministic earnings summary
  const summary: EarningsSummary = calculateEarningsSummary(shifts);
  const t = UI_TEXT[currentLang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        jurySession={jurySession}
        onOpenJuryModal={() => setIsJuryModalOpen(true)}
        onLogoutJury={handleLogoutJury}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'earnings' && (
          <EarningsTracker
            entries={shifts}
            summary={summary}
            onAddShift={handleAddShift}
            onDeleteShift={handleDeleteShift}
            onSelectForGrievance={handleSelectForGrievance}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'companion' && (
          <AiCompanion currentLang={currentLang} earningsSummary={summary} />
        )}

        {activeTab === 'safety' && <SafetyGuide currentLang={currentLang} />}

        {activeTab === 'schemes' && <SchemeAwareness currentLang={currentLang} />}

        {activeTab === 'documents' && <DocumentHelper currentLang={currentLang} />}

        {activeTab === 'grievance' && (
          <GrievanceDrafter
            initialShift={selectedShiftForGrievance}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">KaamSaathi (काम साथी)</span>
            <span>•</span>
            <span>Independent Gig Worker Digital Companion</span>
          </div>
          <div className="text-slate-400">
            Real Gemini 3.8 API • Zero Hallucinations • Deterministic Math
          </div>
        </div>
      </footer>

      {/* Jury Authentication Modal */}
      <JuryModal
        isOpen={isJuryModalOpen}
        onClose={() => setIsJuryModalOpen(false)}
        onLoginSuccess={(user) => {
          setJurySession((prev) => ({ ...prev, authenticated: true, user }));
        }}
        isConfigured={jurySession.isConfigured}
      />
    </div>
  );
}
