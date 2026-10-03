import type { Activity, Category, PackingItem, Trip } from '../types';

export const STORAGE_KEY = 'trips.v1';

export interface TripsData {
  trips: Trip[];
  activities: Activity[];
  packingItems: PackingItem[];
}

const CATEGORY_VALUES: readonly string[] = [
  'unterkunft',
  'transport',
  'verpflegung',
  'aktivitaet',
  'sonstiges',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && CATEGORY_VALUES.includes(value);
}

function isTrip(value: unknown): value is Trip {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.destination) &&
    isNonEmptyString(value.startDate) &&
    isNonEmptyString(value.endDate)
  );
}

function isActivity(value: unknown): value is Activity {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.tripId) &&
    isNonEmptyString(value.time) &&
    isString(value.place) &&
    isFiniteNumber(value.cost) &&
    isCategory(value.category)
  );
}

function isPackingItem(value: unknown): value is PackingItem {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.tripId) &&
    isNonEmptyString(value.name) &&
    typeof value.packed === 'boolean'
  );
}

export function emptyData(): TripsData {
  return { trips: [], activities: [], packingItems: [] };
}

export function normalizeTripsData(input: unknown): TripsData {
  const result = emptyData();
  if (!isRecord(input)) return result;

  if (Array.isArray(input.trips)) {
    result.trips = input.trips.filter(isTrip);
  }
  if (Array.isArray(input.activities)) {
    result.activities = input.activities.filter(isActivity);
  }
  if (Array.isArray(input.packingItems)) {
    result.packingItems = input.packingItems.filter(isPackingItem);
  }

  return result;
}

function getStorage(): Storage | null {
  try {
    const storage = (globalThis as { localStorage?: Storage }).localStorage;
    return storage ?? null;
  } catch {
    return null;
  }
}

export function loadTripsData(): TripsData {
  try {
    const storage = getStorage();
    if (!storage) return emptyData();
    const raw = storage.getItem(STORAGE_KEY);
    if (raw == null) return emptyData();
    return normalizeTripsData(JSON.parse(raw));
  } catch {
    return emptyData();
  }
}

export function saveTripsData(data: TripsData): void {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable or full — data remains in memory.
  }
}
