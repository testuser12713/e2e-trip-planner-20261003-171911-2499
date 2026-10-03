import { describe, expect, it } from 'vitest';
import { getBudgetByCategory } from '../budget';
import type { Activity, Category } from '../../types';

function activity(id: string, category: Category, cost: number): Activity {
  return { id, tripId: 't1', date: '2026-05-12', time: '10:00', place: 'Ort', cost, category };
}

describe('getBudgetByCategory', () => {
  it('returns all five categories with 0 for an empty list', () => {
    const { byCategory, total } = getBudgetByCategory([]);
    expect(Object.keys(byCategory).sort()).toEqual([
      'aktivitaet',
      'sonstiges',
      'transport',
      'unterkunft',
      'verpflegung',
    ]);
    expect(byCategory.unterkunft).toBe(0);
    expect(byCategory.transport).toBe(0);
    expect(byCategory.verpflegung).toBe(0);
    expect(byCategory.aktivitaet).toBe(0);
    expect(byCategory.sonstiges).toBe(0);
    expect(total).toBe(0);
  });

  it('sums costs per category and computes the total', () => {
    const activities = [
      activity('a', 'unterkunft', 120),
      activity('b', 'unterkunft', 80),
      activity('c', 'transport', 30),
      activity('d', 'verpflegung', 25.5),
      activity('e', 'aktivitaet', 10),
    ];
    const { byCategory, total } = getBudgetByCategory(activities);
    expect(byCategory.unterkunft).toBe(200);
    expect(byCategory.transport).toBe(30);
    expect(byCategory.verpflegung).toBe(25.5);
    expect(byCategory.aktivitaet).toBe(10);
    expect(byCategory.sonstiges).toBe(0);
    expect(total).toBe(265.5);
  });

  it('rounds floating point drift to two decimals', () => {
    const activities = [
      activity('a', 'verpflegung', 0.1),
      activity('b', 'verpflegung', 0.2),
    ];
    const { byCategory, total } = getBudgetByCategory(activities);
    expect(byCategory.verpflegung).toBe(0.3);
    expect(total).toBe(0.3);
  });
});
