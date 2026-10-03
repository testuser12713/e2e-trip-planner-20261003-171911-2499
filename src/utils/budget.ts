import type { Activity, Category } from '../types';

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export const CATEGORIES: readonly Category[] = [
  'unterkunft',
  'transport',
  'verpflegung',
  'aktivitaet',
  'sonstiges',
] as const;

export function getBudgetByCategory(
  activities: Activity[],
): { byCategory: Record<Category, number>; total: number } {
  const byCategory: Record<Category, number> = {
    unterkunft: 0,
    transport: 0,
    verpflegung: 0,
    aktivitaet: 0,
    sonstiges: 0,
  };

  for (const activity of activities) {
    byCategory[activity.category] += activity.cost;
  }

  let total = 0;
  for (const category of CATEGORIES) {
    byCategory[category] = round2(byCategory[category]);
    total += byCategory[category];
  }

  return { byCategory, total: round2(total) };
}
