import { EmergencyContact } from './types';

export const OFFICIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { service: 'National Emergency Helpline (All-in-One)', number: '112', description: 'Immediate police, fire, or medical dispatch across India.' },
  { service: 'Government Ambulance Services', number: '108', description: 'Emergency medical transport and on-road trauma response.' },
  { service: 'Police Assistance', number: '100', description: 'Direct police control room for road accidents, disputes, or violence.' },
  { service: 'Women Safety Helpline', number: '1091', description: '24x7 emergency helpline for female gig workers and commuters.' },
  { service: 'National Cyber Crime & Payment Fraud', number: '1930', description: 'Immediate reporting of UPI, wallet, or platform account phishing scams.' },
];

export interface SafetyProtocol {
  id: string;
  category: 'delivery' | 'driver' | 'heatwave' | 'accident' | 'site';
  title: {
    en: string;
    hi: string;
    hinglish: string;
  };
  steps: string[];
  warning: string;
}

export const SAFETY_PROTOCOLS: SafetyProtocol[] = [
  {
    id: 'heatwave',
    category: 'heatwave',
    title: {
      en: 'Extreme Heat & Summer Shift Safety',
      hi: 'भीषण गर्मी और लू से बचाव के नियम',
      hinglish: 'Heatwave & Peak Afternoon Delivery Precautions',
    },
    steps: [
      'Carry minimum 2 liters of drinking water with ORS/salt-lemon solution; drink every 20-30 minutes before feeling thirsty.',
      'Take compulsory 15-minute shaded rest breaks between 1:00 PM and 3:30 PM under flyovers, partner hubs, or shaded spots.',
      'Wear light-colored, full-sleeve cotton clothing, a damp cotton scarf/gamcha under your helmet to protect your neck from direct heat.',
      'If experiencing dizziness, confusion, nausea, or cessation of sweating, stop vehicle immediately, rest in shade, loosen clothing, and seek medical help (Heatstroke warning).',
    ],
    warning: 'Severe heat exhaustion can cause blackout while driving. Do not force overtime during heatwave alerts.',
  },
  {
    id: 'accident',
    category: 'accident',
    title: {
      en: 'On-Road Collision & Hit-and-Run Protocol',
      hi: 'सड़क दुर्घटना होने पर तत्काल कदम',
      hinglish: 'Road Accident & Emergency SOS Protocol',
    },
    steps: [
      'Ensure immediate physical safety: Move out of active traffic lane if mobile; turn on bike hazard indicators.',
      'Call 112 or 108 immediately if anyone is injured. Medical stabilization always takes precedence over delivery tasks.',
      'Document vehicle details: Take photos of the vehicle number plate, road intersection, and damage before vehicles are moved.',
      'Trigger in-app Platform SOS (Zomato/Swiggy/Uber Emergency Button) to log timestamped proof with platform insurance teams.',
      'Never agree to coercive private settlements without getting an official police GD (General Diary) or accident record for insurance claims.',
    ],
    warning: 'This protocol does not replace legal or medical professionals. Dial 112 for official emergency dispatch.',
  },
  {
    id: 'night_safety',
    category: 'delivery',
    title: {
      en: 'Late Night Delivery & Threat Assessment',
      hi: 'देर रात डिलीवरी और सुरक्षा सावधानियां',
      hinglish: 'Late Night Delivery Safety Guidelines',
    },
    steps: [
      'Keep your live WhatsApp location shared with a trusted family member or co-worker throughout night shifts.',
      'Inspect delivery drop location before entering isolated dark alleys or unlit basement parking; stay near main street if suspicious.',
      'If a customer insists on delivering to an unmapped dark spot or behaves aggressively, do not enter; call platform rider support and customer from a lit public area.',
      'Keep your phone battery above 30% with a working power bank and bike phone charger.',
    ],
    warning: 'Your personal safety always outweighs any customer rating or platform delivery timer.',
  },
  {
    id: 'construction_site',
    category: 'site',
    title: {
      en: 'Daily Wage Site & Scaffolding Safety',
      hi: 'दैनिक मज़दूरी और निर्माण स्थल सुरक्षा',
      hinglish: 'Construction Site & Physical Safety Basics',
    },
    steps: [
      'Always demand and wear basic PPE: ISI-marked safety helmet, steel-toe boots or durable footwear, and high-visibility vest.',
      'Never step onto bamboo or metal scaffolding without verifying safety tie-offs and sturdy floor planks.',
      'Ensure electric cables on wet construction ground are industrial-grade and elevated away from standing water puddles.',
      'Ensure the contractor provides on-site clean potable drinking water and clean first-aid kit under statutory labor rules.',
    ],
    warning: 'Report faulty scaffolding or missing harness cords immediately before ascending heights above 6 feet.',
  },
];
