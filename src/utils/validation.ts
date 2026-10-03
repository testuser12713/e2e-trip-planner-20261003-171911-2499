import type { ActivityDraft, Category, TripDraft } from '../types';

const CATEGORY_VALUES: readonly Category[] = [
  'unterkunft',
  'transport',
  'verpflegung',
  'aktivitaet',
  'sonstiges',
] as const;

export function validateTrip(draft: TripDraft): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.destination || !draft.destination.trim()) {
    errors.destination = 'Bitte gib ein Ziel an.';
  }
  if (!draft.startDate) {
    errors.startDate = 'Bitte wähle ein Startdatum.';
  }
  if (!draft.endDate) {
    errors.endDate = 'Bitte wähle ein Enddatum.';
  }
  if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) {
    errors.endDate = 'Das Enddatum liegt vor dem Startdatum. Bitte korrigieren.';
  }

  return errors;
}

export function validateActivity(draft: ActivityDraft): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.date) {
    errors.date = 'Bitte wähle einen Tag.';
  }
  if (!draft.time) {
    errors.time = 'Bitte gib eine Uhrzeit an.';
  }
  if (!draft.place || !draft.place.trim()) {
    errors.place = 'Bitte gib einen Ort an.';
  } else if (draft.place.trim().length > 120) {
    errors.place = 'Der Ort darf höchstens 120 Zeichen lang sein.';
  }
  if (typeof draft.cost !== 'number' || !Number.isFinite(draft.cost) || draft.cost < 0) {
    errors.cost = 'Bitte gib einen gültigen Betrag ein.';
  } else if (Math.round((draft.cost + Number.EPSILON) * 100) / 100 !== draft.cost) {
    errors.cost = 'Bitte gib höchstens zwei Nachkommastellen an.';
  }
  if (!CATEGORY_VALUES.includes(draft.category)) {
    errors.category = 'Bitte wähle eine Kategorie.';
  }

  return errors;
}
