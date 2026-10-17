'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { UI_TEXT } from '@/lib/i18n';
import { ShieldCheck, UserCheck, Lock, Globe, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  jurySession: { authenticated: boolean; isConfigured: boolean; user?: string | null };
  onOpenJuryModal: () => void;
  onLogoutJury: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  jurySession,
  onOpenJuryModal,
  onLogoutJury,
}) => {
  const t = UI_TEXT[currentLang];

  const navItems = [
    { id: 'earnings', label: t.tabs.earnings },
    { id: 'companion', label: t.tabs.companion },
    { id: 'safety', label: t.tabs.safety },
    { id: 'schemes', label: t.tabs.schemes },
    { id: 'documents', label: t.tabs.documents },
    { id: 'grievance', label: t.tabs.grievance },
  ];

  return (
    <header className="bg-slate-900 border-b border-amber-600/30 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('earnings')}>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl sm:text-2xl">
              KS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  {t.appTitle}
                </span>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                  काम साथी
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate max-w-sm">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Right Controls: Language Selector + Jury Auth */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <Globe className="h-4 w-4 text-amber-400 ml-1.5 mr-1 hidden xs:block" />
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang === 'hi'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-label="Switch to Hindi"
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hinglish')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang === 'hinglish'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-label="Switch to Hinglish"
              >
                Hinglish
              </button>
            </div>

            {/* Jury Auth Badge */}
            {jurySession.authenticated ? (
              <div className="flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold hidden sm:inline">{jurySession.user} (Jury)</span>
                <button
                  type="button"
                  onClick={onLogoutJury}
                  className="text-xs text-slate-400 hover:text-red-300 ml-1 underline"
                >
                  {t.logoutJury}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenJuryModal}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition-colors"
                title="Authenticate with Server JURY_USERNAME & JURY_PASSWORD"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.loginJury}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'companion' && <Sparkles className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
