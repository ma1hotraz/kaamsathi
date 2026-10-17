import { WelfareScheme } from './types';

export const VERIFIED_WELFARE_SCHEMES: WelfareScheme[] = [
  {
    id: 'eshram',
    name: {
      en: 'e-Shram National Database for Unorganised Workers',
      hi: 'ई-श्रम पोर्टल (असंगठित कामगार राष्ट्रीय डेटाबेस)',
      hinglish: 'e-Shram Portal (Unorganised Workers Database)',
    },
    category: 'welfare',
    targetGroup: 'Gig delivery workers, drivers, construction laborers, domestic workers aged 16–59.',
    keyBenefits: [
      'Universal 12-digit UAN (Universal Account Number) card valid nationwide.',
      'Accidental insurance coverage under PM Suraksha Bima Yojana (PMSBY): Up to ₹2 Lakh for accidental death/permanent disability, ₹1 Lakh for partial disability (subject to active scheme convergence).',
      'Direct benefit transfer (DBT) during national emergencies or disaster relief distributions.',
    ],
    officialPortal: 'https://eshram.gov.in',
    howToApply: [
      'Self-registration using Aadhaar linked with active mobile number at eshram.gov.in',
      'Or visit your nearest Common Service Centre (CSC) for assisted biometric registration (Free of cost).',
    ],
    documentsNeeded: ['Aadhaar Number', 'Aadhaar-linked Mobile Number', 'Active Bank Account (Savings account number & IFSC)'],
    uncertaintyDisclaimer:
      'Official note: e-Shram is a national registration registry. State-specific welfare funds and emergency cash transfers depend on respective State Government notifications and budget releases.',
  },
  {
    id: 'pmsym',
    name: {
      en: 'Pradhan Mantri Shram Yogi Maandhan (PM-SYM)',
      hi: 'प्रधानमंत्री श्रम योगी मानधन योजना (वृद्धावस्था पेंशन)',
      hinglish: 'PM-SYM Pension Scheme for Gig & Daily Wage Workers',
    },
    category: 'pension',
    targetGroup: 'Unorganised workers with monthly income up to ₹15,000 and entry age between 18 to 40 years.',
    keyBenefits: [
      'Assured minimum monthly pension of ₹3,000 per month after attaining age 60.',
      '50:50 matching government contribution (e.g. if you contribute ₹100/mo, Central Govt contributes ₹100/mo).',
      'Family pension protection: If beneficiary passes away, spouse receives 50% family pension.',
    ],
    officialPortal: 'https://maandhan.in',
    howToApply: [
      'Enroll at any nearest CSC Jan Seva Kendra or online through maandhan.in',
      'Auto-debit setup from bank account for monthly contribution (₹55 to ₹200 depending on joining age).',
    ],
    documentsNeeded: ['Aadhaar Card', 'Savings Bank Account Passbook / Cheque'],
    uncertaintyDisclaimer:
      'Official note: Requires consistent voluntary monthly contributions until age 60. Workers paying statutory Income Tax or covered under EPFO/ESIC/NPS are legally ineligible.',
  },
  {
    id: 'bocw',
    name: {
      en: 'Building and Other Construction Workers (BOCW) Welfare Boards',
      hi: 'भवन एवं सन्निर्माण कर्मकार कल्याण बोर्ड (BOCW)',
      hinglish: 'BOCW Construction & Daily Wage Worker Board',
    },
    category: 'welfare',
    targetGroup: 'Construction workers, painters, masons, carpenters, electricians, plumbers with at least 90 days site work in a year.',
    keyBenefits: [
      'State-administered financial assistance for children education grants.',
      'Maternity benefits for women workers and medical assistance.',
      'Subsidized tool/equipment purchase assistance in eligible states.',
      'Accidental death assistance ranging from ₹1 Lakh to ₹4 Lakhs depending on state board rules.',
    ],
    officialPortal: 'https://labour.gov.in (Check respective State Labor Board Portal, e.g. upbocw.in, bocw.delhi.gov.in)',
    howToApply: [
      'Submit Form-XXVII with contractor/employer 90-day work certificate to the local District Labor Officer or state BOCW portal.',
    ],
    documentsNeeded: ['Aadhaar Card', '90-Day Work Verification from Contractor/Gram Pradhan', 'Bank Passbook', 'Passport Photo'],
    uncertaintyDisclaimer:
      'Critical: Benefits, grant amounts, and eligibility strictly vary by individual state boards. Verification at your state labour office or portal is mandatory.',
  },
  {
    id: 'pmjay',
    name: {
      en: 'Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)',
      hi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (मुफ़्त इलाज)',
      hinglish: 'Ayushman Bharat Cashless Healthcare Card',
    },
    category: 'health',
    targetGroup: 'Vulnerable and deprived rural/urban informal worker families identified under SECC database and state-expanded lists.',
    keyBenefits: [
      'Up to ₹5 Lakhs per family per year for secondary and tertiary hospitalized care.',
      'Cashless and paperless access at empanelled public and private hospitals across India.',
      'Covers pre-existing conditions from Day 1.',
    ],
    officialPortal: 'https://pmjay.gov.in (Verify eligibility at mera.pmjay.gov.in)',
    howToApply: [
      'Check family eligibility by entering mobile number or Ration Card number at mera.pmjay.gov.in',
      'Generate Ayushman Card with Aadhaar e-KYC at any empaneled government hospital or CSC center.',
    ],
    documentsNeeded: ['Aadhaar Card', 'Ration Card / Parivar Pehchan Patra', 'Mobile Number'],
    uncertaintyDisclaimer:
      'Notice: Coverage is strictly entitlement-based per government registry. Not all workers qualify automatically unless their household is in the target welfare registry.',
  },
];
