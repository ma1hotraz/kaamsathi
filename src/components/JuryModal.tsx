'use client';

import React, { useState } from 'react';
import { Lock, X, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

interface JuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: string) => void;
  isConfigured: boolean;
}

export const JuryModal: React.FC<JuryModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isConfigured,
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      onLoginSuccess(data.user || username);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Jury Access Portal</h3>
            <p className="text-xs text-slate-400">Server-side Environment Authentication</p>
          </div>
        </div>

        {!isConfigured && (
          <div className="mb-4 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 space-y-1">
            <div className="flex items-center space-x-1 font-bold">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <span>Server Environment Notice</span>
            </div>
            <p className="text-amber-200/80 leading-relaxed text-[11px]">
              <code>JURY_USERNAME</code> and <code>JURY_PASSWORD</code> are not yet set in the server environment. Please configure them in your Vercel Project Environment Variables to enable full jury session verification.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-rose-950/50 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-300 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Jury Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter configured JURY_USERNAME"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Jury Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter configured JURY_PASSWORD"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>{isLoading ? 'Verifying...' : 'Authenticate Jury Session'}</span>
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-500 text-center mt-4">
          Credentials are strictly evaluated server-side and issued as an httpOnly signed session cookie.
        </p>
      </div>
    </div>
  );
};
