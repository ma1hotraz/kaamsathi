import { ShiftEntry, EarningsSummary, CalculationValidationResult } from './types';

/**
 * Validates a shift entry before adding/updating.
 * Guarantees no negative values, valid date, and reasonable hours.
 */
export function validateShiftInput(input: {
  date: string;
  hoursWorked: number;
  grossEarnings: number;
  expenses: number;
}): CalculationValidationResult {
  const errors: string[] = [];

  if (!input.date || isNaN(Date.parse(input.date))) {
    errors.push('A valid date is required.');
  }

  if (typeof input.hoursWorked !== 'number' || isNaN(input.hoursWorked)) {
    errors.push('Hours worked must be a valid number.');
  } else if (input.hoursWorked < 0) {
    errors.push('Hours worked cannot be negative.');
  } else if (input.hoursWorked > 24) {
    errors.push('Hours worked cannot exceed 24 hours in a single shift.');
  }

  if (typeof input.grossEarnings !== 'number' || isNaN(input.grossEarnings)) {
    errors.push('Gross earnings must be a valid number.');
  } else if (input.grossEarnings < 0) {
    errors.push('Gross earnings cannot be negative.');
  }

  if (typeof input.expenses !== 'number' || isNaN(input.expenses)) {
    errors.push('Expenses must be a valid number.');
  } else if (input.expenses < 0) {
    errors.push('Expenses cannot be negative.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Deterministically calculates summary metrics across shift entries.
 * Returns zeros on empty history and safely prevents division by zero.
 */
export function calculateEarningsSummary(entries: ShiftEntry[]): EarningsSummary {
  if (!entries || entries.length === 0) {
    return {
      totalGross: 0,
      totalExpenses: 0,
      netEarnings: 0,
      totalHours: 0,
      effectiveHourlyRate: 0,
      expenseRatioPercentage: 0,
      shiftCount: 0,
    };
  }

  let totalGross = 0;
  let totalExpenses = 0;
  let totalHours = 0;

  for (const entry of entries) {
    const gross = Math.max(0, Number(entry.grossEarnings) || 0);
    const exp = Math.max(0, Number(entry.expenses) || 0);
    const hrs = Math.max(0, Number(entry.hoursWorked) || 0);

    totalGross += gross;
    totalExpenses += exp;
    totalHours += hrs;
  }

  const netEarnings = totalGross - totalExpenses;

  // Round currency to 2 decimals deterministically
  const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  const effectiveHourlyRate = totalHours > 0 ? round2(netEarnings / totalHours) : 0;
  const expenseRatioPercentage = totalGross > 0 ? round2((totalExpenses / totalGross) * 100) : 0;

  return {
    totalGross: round2(totalGross),
    totalExpenses: round2(totalExpenses),
    netEarnings: round2(netEarnings),
    totalHours: round2(totalHours),
    effectiveHourlyRate,
    expenseRatioPercentage,
    shiftCount: entries.length,
  };
}
