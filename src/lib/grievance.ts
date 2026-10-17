import { GrievanceInput, GrievanceDraft } from './types';

/**
 * Deterministically constructs a structured, professional grievance letter.
 * Strictly adheres to facts supplied by the user.
 * Explicitly marks missing information with [NEEDED: ...] placeholders.
 * NEVER fabricates amounts, dates, platforms, or accusations.
 */
export function generateGrievanceDraft(input: GrievanceInput): GrievanceDraft {
  const placeholdersFound: string[] = [];

  const platformName = input.platform?.trim() || (() => {
    placeholdersFound.push('Platform/Company Name');
    return '[NEEDED: Platform/Company Name]';
  })();

  const workerName = input.workerName?.trim() || (() => {
    placeholdersFound.push('Worker Full Name');
    return '[NEEDED: Worker Full Name]';
  })();

  const workerId = input.workerId?.trim() || (() => {
    placeholdersFound.push('Worker/Partner ID');
    return '[NEEDED: Worker/Partner ID]';
  })();

  const incidentDate = input.dateOfIncident?.trim() || (() => {
    placeholdersFound.push('Date of Incident');
    return '[NEEDED: Date of Incident (YYYY-MM-DD)]';
  })();

  const tripOrOrder = input.tripOrOrderId?.trim() || (() => {
    placeholdersFound.push('Trip or Order ID');
    return '[NEEDED: Order/Trip/Task Reference ID]';
  })();

  const description = input.description?.trim() || (() => {
    placeholdersFound.push('Factual Description of Issue');
    return '[NEEDED: Describe the exact sequence of events]';
  })();

  const desiredOutcome = input.desiredOutcome?.trim() || (() => {
    placeholdersFound.push('Desired Resolution');
    return '[NEEDED: Desired resolution (e.g. refund penalty of ₹X, credit pending payout)]';
  })();

  let amountClause = '';
  let disputedAmount: number | null = null;

  if (typeof input.expectedAmount === 'number' && typeof input.receivedAmount === 'number') {
    disputedAmount = Math.max(0, input.expectedAmount - input.receivedAmount);
    amountClause = `
Financial Summary of Discrepancy:
- Agreed / Expected Payout: ₹${input.expectedAmount.toFixed(2)}
- Actual Amount Credited: ₹${input.receivedAmount.toFixed(2)}
- Disputed Shortfall / Deduction: ₹${disputedAmount.toFixed(2)}
`.trim();
  } else if (typeof input.expectedAmount === 'number') {
    amountClause = `- Expected Payout: ₹${input.expectedAmount.toFixed(2)} (Actual amount credited was not specified)`;
  } else {
    placeholdersFound.push('Exact Financial Amounts');
    amountClause = '- Financial Details: [NEEDED: Specify Expected Amount and Actual Amount Received if applicable]';
  }

  const categoryLabels: Record<string, string> = {
    penalty_dispute: 'Wrongful Penalty / Deduction Dispute',
    delayed_payout: 'Delayed / Unsettled Shift Payout',
    distance_mismatch: 'Trip Distance / Surge Incentive Discrepancy',
    app_glitch: 'App Technical Glitch Affecting Earnings',
    deactivation: 'Account Deactivation Appeal & Inquiry',
    harassment: 'Safety Incident / Unfair Treatment Report',
    other: 'Formal Operational Grievance',
  };

  const subject = `Urgent Grievance: ${categoryLabels[input.issueCategory] || 'Payment & Account Issue'} - Partner ID: ${workerId}`;

  const formalLetter = `
To,
The Grievance Officer / Partner Support Team,
${platformName}

Date: ${new Date().toISOString().split('T')[0]}
Subject: ${subject}

Dear Support Team,

I am writing this formal grievance regarding an unresolved issue encountered during my active service on your platform.

Worker & Incident Details:
- Partner Name: ${workerName}
- Partner ID: ${workerId}
- Date of Incident: ${incidentDate}
- Order / Trip Reference: ${tripOrOrder}

${amountClause}

Detailed Description of Events:
${description}

Supporting Documentation:
[NEEDED: Attach screenshots of trip receipt, earnings dashboard, or in-app communication]

Requested Resolution:
${desiredOutcome}

I request this matter be investigated objectively in accordance with platform partner guidelines and applicable fair labor norms, and resolved within 48 hours.

Sincerely,
${workerName}
Contact / Registered Mobile: [NEEDED: Registered Mobile Number]
`.trim();

  const inAppChatVersion = `
Hi Support, I am reporting an issue (${categoryLabels[input.issueCategory] || 'Grievance'}).
Partner ID: ${workerId} | Ref: ${tripOrOrder} | Date: ${incidentDate}
Issue: ${description}
${disputedAmount !== null ? `Disputed difference: ₹${disputedAmount.toFixed(2)}.` : ''}
Required Action: ${desiredOutcome}
Please escalate to a supervisor if unresolved.
`.trim();

  return {
    subject,
    formalLetter,
    inAppChatVersion,
    placeholdersFound,
    disputedAmount,
    timestamp: new Date().toISOString(),
  };
}
