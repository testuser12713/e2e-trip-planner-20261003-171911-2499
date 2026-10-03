import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  emptyData,
  loadTripsData,
  normalizeTripsData,
  saveTripsData,
  STORAGE_KEY,
  type TripsData,
} from '../storage';

interface MemoryStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

function createMemoryStorage(): MemoryStorage {
  const store = new Map<string, string>();
  return {
    getItem: (key) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = createMemoryStorage();
  vi.stubGlobal('localStorage', storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadTripsData', () => {
  it('returns empty data when nothing is stored', () => {
    expect(loadTripsData()).toEqual(emptyData());
  });

  it('returns empty data when the stored value is not valid JSON', () => {
    storage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadTripsData()).toEqual(emptyData());
  });

  it('returns empty data when the stored value is not an object', () => {
    storage.setItem(STORAGE_KEY, JSON.stringify('just a string'));
    expect(loadTripsData()).toEqual(emptyData());
  });

  it('does not throw when localStorage access fails', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('boom');
      },
    });
    expect(loadTripsData()).toEqual(emptyData());
  });
});

describe('normalizeTripsData', () => {
  it('ignores invalid entries and keeps valid ones', () => {
    const input = {
      trips: [
        { id: 't1', destination: 'Lissabon', startDate: '2026-05-12', endDate: '2026-05-19' },
        { id: 42, destination: '', startDate: 'x', endDate: 'y' },
        'nope',
        null,
      ],
      activities: [
        { id: 'a1', tripId: 't1', time: '10:00', place: 'Ort', cost: 5, category: 'transport' },
        { id: 'a2', tripId: 't1', time: '10:00', place: 'Ort', cost: 'five', category: 'transport' },
        { id: 'a3', tripId: 't1', time: '10:00', place: 'Ort', cost: 5, category: 'magic' },
      ],
      packingItems: [
        { id: 'p1', tripId: 't1', name: 'Pass', packed: false },
        { id: 'p2', tripId: 't1', name: 'Pass', packed: 'yes' },
      ],
    };

    const result = normalizeTripsData(input);
    expect(result.trips).toHaveLength(1);
    expect(result.trips[0].id).toBe('t1');
    expect(result.activities).toHaveLength(1);
    expect(result.activities[0].id).toBe('a1');
    expect(result.packingItems).toHaveLength(1);
    expect(result.packingItems[0].id).toBe('p1');
  });
});

describe('saveTripsData / loadTripsData round trip', () => {
  it('persists and reloads the full data', () => {
    const data: TripsData = {
      trips: [
        { id: 't1', destination: 'Lissabon', startDate: '2026-05-12', endDate: '2026-05-19' },
      ],
      activities: [
        { id: 'a1', tripId: 't1', time: '10:00', place: 'Ort', cost: 5, category: 'transport' },
      ],
      packingItems: [{ id: 'p1', tripId: 't1', name: 'Pass', packed: true }],
    };

    saveTripsData(data);
    expect(loadTripsData()).toEqual(data);
  });
});
