import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TripsProvider, useTrips, type TripsContextValue } from '../../../store/tripsStore';
import { STORAGE_KEY } from '../../../store/storage';
import { validateActivity } from '../../../utils/validation';
import type { Activity, ActivityDraft, Trip } from '../../../types';
import PlanView from '../PlanView';

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

const trip: Trip = {
  id: 't1',
  destination: 'Lissabon',
  startDate: '2026-05-12',
  endDate: '2026-05-14',
};

function activity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'a',
    tripId: 't1',
    date: '2026-05-12',
    time: '10:00',
    place: 'Ort',
    cost: 0,
    category: 'sonstiges',
    ...overrides,
  };
}

function seed(activities: Activity[]): void {
  const storage = createMemoryStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({ trips: [trip], activities, packingItems: [] }));
  vi.stubGlobal('localStorage', storage);
}

function renderPlan(): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={['/trips/t1/plan']}>
      <TripsProvider>
        <Routes>
          <Route path="/trips/:id/plan" element={<PlanView />} />
        </Routes>
      </TripsProvider>
    </MemoryRouter>,
  );
}

function Capture({ onCapture }: { onCapture: (ctx: TripsContextValue) => void }) {
  onCapture(useTrips());
  return null;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PlanView', () => {
  it('renders every day of the period chronologically, including empty days', () => {
    seed([]);
    const html = renderPlan();

    expect(html).toContain('Tag 1');
    expect(html).toContain('Tag 2');
    expect(html).toContain('Tag 3');
    expect(html).not.toContain('Tag 4');

    const emptyDays = html.split('Keine Aktivitäten geplant').length - 1;
    expect(emptyDays).toBe(3);
  });

  it('groups activities by day, sorts them by time and shows the daily total', () => {
    seed([
      activity({ id: 'a1', date: '2026-05-12', time: '19:30', place: 'Abendessen', cost: 35 }),
      activity({ id: 'a2', date: '2026-05-12', time: '10:15', place: 'Check-in', cost: 0 }),
      activity({ id: 'a3', date: '2026-05-13', time: '09:00', place: 'Tram', cost: 3 }),
    ]);
    const html = renderPlan();

    expect(html.indexOf('10:15')).toBeGreaterThan(-1);
    expect(html.indexOf('19:30')).toBeGreaterThan(-1);
    expect(html.indexOf('10:15')).toBeLessThan(html.indexOf('19:30'));

    expect(html).toContain('Abendessen');
    expect(html).toContain('Check-in');
    expect(html).toContain('Tram');

    expect(html).toContain('35,00 €');
    expect(html).toContain('3,00 €');
    expect(html).toContain('0,00 €');
  });

  it('creates an activity for a specific day through the store', () => {
    seed([]);
    let captured: TripsContextValue | null = null;
    renderToStaticMarkup(
      <TripsProvider>
        <Capture
          onCapture={(ctx) => {
            captured = ctx;
          }}
        />
      </TripsProvider>,
    );

    const draft: ActivityDraft = {
      date: '2026-05-12',
      time: '14:00',
      place: 'Museum besuchen',
      cost: 12,
      category: 'aktivitaet',
    };
    expect(validateActivity(draft)).toEqual({});

    const created = captured!.addActivity('t1', draft);
    expect(created).toMatchObject({
      tripId: 't1',
      date: '2026-05-12',
      time: '14:00',
      place: 'Museum besuchen',
      cost: 12,
      category: 'aktivitaet',
    });
    expect(created.id).toBeTruthy();
  });

  it('rejects invalid activity drafts', () => {
    expect(
      validateActivity({ date: '', time: '10:00', place: 'Ort', cost: 0, category: 'sonstiges' }).date,
    ).toBeTruthy();
    expect(
      validateActivity({ date: '2026-05-12', time: '', place: 'Ort', cost: 0, category: 'sonstiges' }).time,
    ).toBeTruthy();
    expect(
      validateActivity({ date: '2026-05-12', time: '10:00', place: '', cost: 0, category: 'sonstiges' }).place,
    ).toBeTruthy();
  });
});
