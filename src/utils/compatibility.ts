import type { BloodGroup } from '../types/index.ts';

export interface CompatibilityInfo {
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  isUniversalDonor: boolean;
  isUniversalRecipient: boolean;
  populationPercentageIndia: string;
  rarityDescription: string;
}

export const BLOOD_COMPATIBILITY: Record<BloodGroup, CompatibilityInfo> = {
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    isUniversalDonor: true,
    isUniversalRecipient: false,
    populationPercentageIndia: '~1.5%',
    rarityDescription: 'Universal Red Blood Cell donor. Highly critical in emergency trauma resuscitations before cross-matching is completed.',
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    populationPercentageIndia: '~37.1%',
    rarityDescription: 'Most common blood group. High demand in routine surgeries, cancer chemotherapy, and post-natal care.',
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    populationPercentageIndia: '~0.6%',
    rarityDescription: 'Rare blood type. Donors are in high demand for pediatric and immunosuppressed recipients.',
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    populationPercentageIndia: '~21.4%',
    rarityDescription: 'Second most common group. Critical for scheduled cardiothoracic and orthopedic surgeries.',
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'B-'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    populationPercentageIndia: '~1.8%',
    rarityDescription: 'Rare Rh-negative group. High clinical vigilance needed in regional blood banking inventories.',
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    populationPercentageIndia: '~32.3%',
    rarityDescription: 'Very common in South Asia. Massive continuous requirement for thalassemia and dengue platelet units.',
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'],
    isUniversalDonor: false,
    isUniversalRecipient: false,
    populationPercentageIndia: '~0.4%',
    rarityDescription: 'Rarest Rh-negative group in the general population. Universal Plasma donor.',
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    isUniversalDonor: false,
    isUniversalRecipient: true,
    populationPercentageIndia: '~4.9%',
    rarityDescription: 'Universal Red Blood Cell recipient. Can accept red cells from any blood type in emergencies.',
  },
};

export function checkCompatibility(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  return BLOOD_COMPATIBILITY[donorGroup].canDonateTo.includes(recipientGroup);
}
