import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateEarningsSummary, validateShiftInput } from './calculations';
import { ShiftEntry } from './types';

describe('Earnings Calculations Suite', () => {
  test('returns zero metrics on empty history', () => {
    const summary = calculateEarningsSummary([]);
    assert.deepEqual(summary, {
      totalGross: 0,
      totalExpenses: 0,
      netEarnings: 0,
      totalHours: 0,
      effectiveHourlyRate: 0,
      expenseRatioPercentage: 0,
      shiftCount: 0,
    });
  });

  test('calculates correct metrics with valid single shift', () => {
    const shifts: ShiftEntry[] = [
      {
        id: '1',
        date: '2026-10-17',
        platform: 'Zomato',
        hoursWorked: 8,
        grossEarnings: 1200,
        expenses: 250,
        createdAt: Date.now(),
      },
    ];

    const summary = calculateEarningsSummary(shifts);
    assert.equal(summary.totalGross, 1200);
    assert.equal(summary.totalExpenses, 250);
    assert.equal(summary.netEarnings, 950);
    assert.equal(summary.totalHours, 8);
    // 950 / 8 = 118.75
    assert.equal(summary.effectiveHourlyRate, 118.75);
    // (250 / 1200) * 100 = 20.83%
    assert.equal(summary.expenseRatioPercentage, 20.83);
    assert.equal(summary.shiftCount, 1);
  });

  test('safely handles zero hours worked without division by zero', () => {
    const shifts: ShiftEntry[] = [
      {
        id: '1',
        date: '2026-10-17',
        platform: 'Urban Company',
        hoursWorked: 0,
        grossEarnings: 500,
        expenses: 50,
        createdAt: Date.now(),
      },
    ];

    const summary = calculateEarningsSummary(shifts);
    assert.equal(summary.totalHours, 0);
    assert.equal(summary.effectiveHourlyRate, 0); // No NaN or Infinity!
    assert.equal(summary.netEarnings, 450);
  });

  test('safely handles zero expenses', () => {
    const shifts: ShiftEntry[] = [
      {
        id: '1',
        date: '2026-10-17',
        platform: 'Swiggy',
        hoursWorked: 5,
        grossEarnings: 800,
        expenses: 0,
        createdAt: Date.now(),
      },
    ];

    const summary = calculateEarningsSummary(shifts);
    assert.equal(summary.totalExpenses, 0);
    assert.equal(summary.netEarnings, 800);
    assert.equal(summary.effectiveHourlyRate, 160);
    assert.equal(summary.expenseRatioPercentage, 0);
  });

  test('validates and rejects negative values and invalid hours', () => {
    const negHours = validateShiftInput({
      date: '2026-10-17',
      hoursWorked: -2,
      grossEarnings: 500,
      expenses: 100,
    });
    assert.equal(negHours.isValid, false);
    assert.ok(negHours.errors.some((e) => e.includes('negative')));

    const negGross = validateShiftInput({
      date: '2026-10-17',
      hoursWorked: 4,
      grossEarnings: -500,
      expenses: 100,
    });
    assert.equal(negGross.isValid, false);
    assert.ok(negGross.errors.some((e) => e.includes('Gross earnings cannot be negative')));

    const excessiveHours = validateShiftInput({
      date: '2026-10-17',
      hoursWorked: 26,
      grossEarnings: 500,
      expenses: 100,
    });
    assert.equal(excessiveHours.isValid, false);
    assert.ok(excessiveHours.errors.some((e) => e.includes('cannot exceed 24 hours')));

    const valid = validateShiftInput({
      date: '2026-10-17',
      hoursWorked: 8.5,
      grossEarnings: 1450,
      expenses: 320,
    });
    assert.equal(valid.isValid, true);
    assert.equal(valid.errors.length, 0);
  });
});
