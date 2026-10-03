import { describe, expect, it } from 'vitest';
import { getDailyTotal, getDaysBetween, sortActivitiesByTime } from '../dates';
import type { Activity } from '../../types';

function activity(id: string, time: string, cost: number): Activity {
  return { id, tripId: 't1', date: '2026-05-12', time, place: 'Ort', cost, category: 'sonstiges' };
}

describe('getDaysBetween', () => {
  it('returns every day inclusively and chronologically', () => {
    expect(getDaysBetween('2026-05-12', '2026-05-14')).toEqual([
      '2026-05-12',
      '2026-05-13',
      '2026-05-14',
    ]);
  });

  it('returns a single day for equal start and end', () => {
    expect(getDaysBetween('2026-05-12', '2026-05-12')).toEqual(['2026-05-12']);
  });

  it('returns an empty list when end is before start', () => {
    expect(getDaysBetween('2026-05-14', '2026-05-12')).toEqual([]);
  });

  it('returns an empty list for malformed dates', () => {
    expect(getDaysBetween('not-a-date', '2026-05-14')).toEqual([]);
    expect(getDaysBetween('2026-02-30', '2026-03-01')).toEqual([]);
  });
});

describe('sortActivitiesByTime', () => {
  it('sorts ascending by time', () => {
    const input = [
      activity('a', '19:30', 0),
      activity('b', '09:00', 0),
      activity('c', '14:00', 0),
    ];
    expect(sortActivitiesByTime(input).map((a) => a.id)).toEqual(['b', 'c', 'a']);
  });

  it('does not mutate the input array', () => {
    const input = [activity('a', '19:30', 0), activity('b', '09:00', 0)];
    const copy = [...input];
    sortActivitiesByTime(input);
    expect(input).toEqual(copy);
  });
});

describe('getDailyTotal', () => {
  it('sums the costs of all activities', () => {
    const activities = [activity('a', '09:00', 10), activity('b', '10:00', 5.5)];
    expect(getDailyTotal(activities)).toBe(15.5);
  });

  it('returns 0 for an empty list', () => {
    expect(getDailyTotal([])).toBe(0);
  });

  it('rounds floating point drift to two decimals', () => {
    const activities = [activity('a', '09:00', 0.1), activity('b', '10:00', 0.2)];
    expect(getDailyTotal(activities)).toBe(0.3);
  });
});
