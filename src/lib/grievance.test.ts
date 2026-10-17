import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateGrievanceDraft } from './grievance';

describe('Grievance Draft Suite', () => {
  test('marks missing information with [NEEDED: ...] placeholders and never invents facts', () => {
    const draft = generateGrievanceDraft({
      platform: '',
      issueCategory: 'delayed_payout',
      dateOfIncident: '',
      description: '',
      language: 'en',
    });

    assert.ok(draft.formalLetter.includes('[NEEDED: Platform/Company Name]'));
    assert.ok(draft.formalLetter.includes('[NEEDED: Worker Full Name]'));
    assert.ok(draft.formalLetter.includes('[NEEDED: Date of Incident (YYYY-MM-DD)]'));
    assert.ok(draft.formalLetter.includes('[NEEDED: Describe the exact sequence of events]'));
    assert.ok(draft.formalLetter.includes('[NEEDED: Attach screenshots'));
    assert.ok(draft.placeholdersFound.length >= 4);
    assert.equal(draft.disputedAmount, null);
  });

  test('preserves user facts exactly and calculates disputed difference', () => {
    const draft = generateGrievanceDraft({
      platform: 'Swiggy',
      workerName: 'Ramesh Kumar',
      workerId: 'SWG-98210',
      issueCategory: 'penalty_dispute',
      dateOfIncident: '2026-10-15',
      expectedAmount: 1450,
      receivedAmount: 950,
      tripOrOrderId: 'ORD-55421',
      description: 'System deducted ₹500 penalty falsely citing late delivery due to heavy rain waterlogging.',
      desiredOutcome: 'Full refund of ₹500 wrongful deduction.',
      language: 'en',
    });

    assert.ok(draft.formalLetter.includes('Swiggy'));
    assert.ok(draft.formalLetter.includes('Ramesh Kumar'));
    assert.ok(draft.formalLetter.includes('SWG-98210'));
    assert.ok(draft.formalLetter.includes('ORD-55421'));
    assert.ok(draft.formalLetter.includes('₹1450.00'));
    assert.ok(draft.formalLetter.includes('₹950.00'));
    assert.ok(draft.formalLetter.includes('₹500.00'));
    assert.equal(draft.disputedAmount, 500);
    assert.equal(draft.placeholdersFound.includes('Worker Full Name'), false);
    assert.equal(draft.placeholdersFound.includes('Platform/Company Name'), false);
  });
});
