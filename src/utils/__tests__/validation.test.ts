import { describe, expect, it } from 'vitest';
import { validateActivity, validateTrip } from '../validation';
import type { ActivityDraft, TripDraft } from '../../types';

describe('validateTrip', () => {
  it('returns no errors for a valid draft', () => {
    const draft: TripDraft = {
      destination: 'Lissabon',
      startDate: '2026-05-12',
      endDate: '2026-05-19',
    };
    expect(validateTrip(draft)).toEqual({});
  });

  it('reports a missing destination', () => {
    const draft: TripDraft = {
      destination: '   ',
      startDate: '2026-05-12',
      endDate: '2026-05-19',
    };
    expect(validateTrip(draft).destination).toBeTruthy();
  });

  it('reports a missing start date', () => {
    const draft: TripDraft = { destination: 'Lissabon', startDate: '', endDate: '2026-05-19' };
    expect(validateTrip(draft).startDate).toBeTruthy();
  });

  it('reports a missing end date', () => {
    const draft: TripDraft = { destination: 'Lissabon', startDate: '2026-05-12', endDate: '' };
    expect(validateTrip(draft).endDate).toBeTruthy();
  });

  it('reports an end date before the start date', () => {
    const draft: TripDraft = {
      destination: 'Lissabon',
      startDate: '2026-05-19',
      endDate: '2026-05-12',
    };
    expect(validateTrip(draft).endDate).toBeTruthy();
  });
});

describe('validateActivity', () => {
  const valid: ActivityDraft = {
    date: '2026-05-12',
    time: '10:15',
    place: 'Museum besuchen',
    cost: 12,
    category: 'aktivitaet',
  };

  it('returns no errors for a valid draft', () => {
    expect(validateActivity(valid)).toEqual({});
  });

  it('reports a missing date', () => {
    expect(validateActivity({ ...valid, date: '' }).date).toBeTruthy();
  });

  it('reports a missing time', () => {
    expect(validateActivity({ ...valid, time: '' }).time).toBeTruthy();
  });

  it('reports a missing place', () => {
    expect(validateActivity({ ...valid, place: '  ' }).place).toBeTruthy();
  });

  it('reports a place longer than 120 characters', () => {
    expect(validateActivity({ ...valid, place: 'a'.repeat(121) }).place).toBeTruthy();
  });

  it('accepts a place of exactly 120 characters', () => {
    expect(validateActivity({ ...valid, place: 'a'.repeat(120) })).toEqual({});
  });

  it('reports a negative cost', () => {
    expect(validateActivity({ ...valid, cost: -1 }).cost).toBeTruthy();
  });

  it('reports a non-finite cost', () => {
    expect(validateActivity({ ...valid, cost: Number.NaN }).cost).toBeTruthy();
  });

  it('reports a cost with more than two decimal places', () => {
    expect(validateActivity({ ...valid, cost: 12.345 }).cost).toBeTruthy();
  });

  it('accepts a cost with exactly two decimal places', () => {
    expect(validateActivity({ ...valid, cost: 12.34 })).toEqual({});
  });

  it('reports an unknown category', () => {
    expect(validateActivity({ ...valid, category: 'unbekannt' as never }).category).toBeTruthy();
  });
});
