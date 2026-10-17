'use client';

import React, { useState } from 'react';
import { ShiftEntry, EarningsSummary, Language } from '@/lib/types';
import { calculateEarningsSummary, validateShiftInput } from '@/lib/calculations';
import { UI_TEXT } from '@/lib/i18n';
import { PlusCircle, Trash2, AlertCircle, FileText, IndianRupee, Clock, Fuel, TrendingUp, Info } from 'lucide-react';

interface EarningsTrackerProps {
  entries: ShiftEntry[];
  summary: EarningsSummary;
  onAddShift: (shift: Omit<ShiftEntry, 'id' | 'createdAt'>) => { success: boolean; errors?: string[] };
  onDeleteShift: (id: string) => void;
  onSelectForGrievance: (shift: ShiftEntry) => void;
  currentLang: Language;
}

export const EarningsTracker: React.FC<EarningsTrackerProps> = ({
  entries,
  summary,
  onAddShift,
  onDeleteShift,
  onSelectForGrievance,
  currentLang,
}) => {
  const t = UI_TEXT[currentLang];

  const [date, setDate] = useState<string>('2026-10-17');

  React.useEffect(() => {
    try {
      setDate(new Date().toISOString().split('T')[0]);
    } catch {}
  }, []);
  const [platform, setPlatform] = useState<string>('Zomato');
  const [hoursWorked, setHoursWorked] = useState<string>('8');
  const [grossEarnings, setGrossEarnings] = useState<string>('1200');
  const [expenses, setExpenses] = useState<string>('250');
  const [expenseType, setExpenseType] = useState<string>('Fuel');
  const [notes, setNotes] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    const parsedHours = parseFloat(hoursWorked);
    const parsedGross = parseFloat(grossEarnings);
    const parsedExpenses = parseFloat(expenses);

    const validation = validateShiftInput({
      date,
      hoursWorked: parsedHours,
      grossEarnings: parsedGross,
      expenses: parsedExpenses,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    const result = onAddShift({
      date,
      platform,
      hoursWorked: parsedHours,
      grossEarnings: parsedGross,
      expenses: parsedExpenses,
      expenseType,
      notes,
    });

    if (result.success) {
      setNotes('');
      setShowAddForm(false);
    } else if (result.errors) {
      setValidationErrors(result.errors);
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy / Storage Disclosure */}
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200 flex items-start space-x-2.5">
        <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-300">Deterministic Calculations & Device-Only Storage</p>
          <p className="text-amber-200/80 mt-0.5">{t.storageNotice}</p>
        </div>
      </div>

      {/* Summary KPI Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Net Earnings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.netEarnings}</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              ₹{summary.netEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">Gross ₹{summary.totalGross} - Expenses ₹{summary.totalExpenses}</p>
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.hourlyRate}</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              ₹{summary.effectiveHourlyRate.toFixed(2)}
              <span className="text-xs font-normal text-slate-400">/hr</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              {summary.totalHours > 0 ? `Across ${summary.totalHours} verified hours` : '0 verified hours recorded'}
            </p>
          </div>
        </div>

        {/* Gross Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.grossEarnings}</span>
            <IndianRupee className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-400">
              ₹{summary.totalGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">{summary.shiftCount} shifts recorded</p>
          </div>
        </div>

        {/* Expense Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{t.expenseRatio}</span>
            <Fuel className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">
              {summary.expenseRatioPercentage.toFixed(1)}%
            </span>
            <p className="text-[10px] text-slate-400 mt-1">₹{summary.totalExpenses} total spent</p>
          </div>
        </div>
      </div>

      {/* Log Shift Button / Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <span>{currentLang === 'hi' ? 'शिफ्ट हिस्ट्री' : 'Recorded Shifts'}</span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
            {entries.length}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm shadow-amber-500/20"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{showAddForm ? t.actions.cancel : t.logShift}</span>
        </button>
      </div>

      {/* Shift Entry Form Modal/Inline */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-base text-white">{t.logShift}</h3>

          {validationErrors.length > 0 && (
            <div className="bg-rose-950/50 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-300 space-y-1">
              <div className="flex items-center space-x-1 font-semibold">
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                <span>Validation Error</span>
              </div>
              <ul className="list-disc list-inside">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform / Work</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Zomato">Zomato</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Uber">Uber</option>
                <option value="Ola">Ola</option>
                <option value="Zepto">Zepto</option>
                <option value="Blinkit">Blinkit</option>
                <option value="Urban Company">Urban Company</option>
                <option value="Daily Wage / Construction">Daily Wage / Construction</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours Worked</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                required
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                placeholder="e.g. 8"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gross Earnings (₹)</label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={grossEarnings}
                onChange={(e) => setGrossEarnings(e.target.value)}
                placeholder="Total before expenses"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expenses / Fuel (₹)</label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="Fuel, maintenance, tea"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Type</label>
              <select
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Fuel">Fuel (Petrol/CNG)</option>
                <option value="Bike Maintenance">Bike/Vehicle Maintenance</option>
                <option value="Platform Deduction">Platform Fine / Deduction</option>
                <option value="Meals & Water">Meals & Water</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Discrepancy Note (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Delayed rain payout or unusual penalty on order #982"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm"
            >
              {t.actions.save}
            </button>
          </div>
        </form>
      )}

      {/* Shifts List or Clean Empty State */}
      {entries.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Clock className="h-8 w-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">{t.noShifts}</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{t.logShift}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((shift) => {
            const net = shift.grossEarnings - shift.expenses;
            const hourly = shift.hoursWorked > 0 ? (net / shift.hoursWorked).toFixed(2) : '0.00';

            return (
              <div
                key={shift.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
                    {shift.platform.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{shift.platform}</span>
                      <span className="text-xs text-slate-400">• {shift.date}</span>
                      <span className="text-xs text-slate-400">• {shift.hoursWorked} hrs</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs mt-1 text-slate-300">
                      <span>Gross: <strong className="text-white">₹{shift.grossEarnings}</strong></span>
                      <span>Expenses: <strong className="text-rose-400">₹{shift.expenses}</strong></span>
                      <span>Net: <strong className="text-emerald-400">₹{net}</strong></span>
                      <span className="text-amber-300">({`₹${hourly}/hr`})</span>
                    </div>
                    {shift.notes && <p className="text-xs text-slate-400 mt-1 italic">&ldquo;{shift.notes}&rdquo;</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onSelectForGrievance(shift)}
                    className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                    title="Pre-fill grievance with this shift data"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">File Grievance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteShift(shift.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    aria-label="Delete Shift"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
