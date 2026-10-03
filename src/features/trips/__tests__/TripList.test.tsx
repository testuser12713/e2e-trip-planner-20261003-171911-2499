import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../../../store/storage';
import { TripsProvider, useTrips } from '../../../store/tripsStore';
import type { Trip, TripDraft } from '../../../types';
import ConfirmDialog from '../ConfirmDialog';
import TripCard from '../TripCard';
import TripForm from '../TripForm';
import TripListPage from '../TripListPage';

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

function seedStorage(data: {
  trips?: Trip[];
  activities?: unknown[];
  packingItems?: unknown[];
}): void {
  const storage = createMemoryStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
  vi.stubGlobal('localStorage', storage);
}

function renderPage(initial?: Parameters<typeof seedStorage>[0]): string {
  if (initial) {
    seedStorage(initial);
  } else {
    seedStorage({});
  }
  return renderToString(
    <TripsProvider>
      <MemoryRouter>
        <TripListPage />
      </MemoryRouter>
    </TripsProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TripListPage', () => {
  it('shows the empty state when no trips are stored', () => {
    const html = renderPage();
    expect(html).toContain('Noch keine Reisen');
    expect(html).toContain('Lege deine erste Reise an');
    expect(html).toContain('Meine Reisen');
  });

  it('renders stored trips as cards sorted ascending by start date', () => {
    const html = renderPage({
      trips: [
        { id: 't-aug', destination: 'Island-Roadtrip', startDate: '2026-08-03', endDate: '2026-08-15' },
        { id: 't-mar', destination: 'Wochenende Hamburg', startDate: '2026-03-20', endDate: '2026-03-22' },
        { id: 't-may', destination: 'Lissabon', startDate: '2026-05-12', endDate: '2026-05-19' },
      ],
    });
    const mar = html.indexOf('Wochenende Hamburg');
    const may = html.indexOf('Lissabon');
    const aug = html.indexOf('Island-Roadtrip');
    expect(mar).toBeGreaterThan(-1);
    expect(may).toBeGreaterThan(-1);
    expect(aug).toBeGreaterThan(-1);
    expect(mar).toBeLessThan(may);
    expect(may).toBeLessThan(aug);
    expect(html).not.toContain('Noch keine Reisen');
  });
});

describe('TripCard', () => {
  const trip: Trip = {
    id: 't1',
    destination: 'Lissabon',
    startDate: '2026-05-12',
    endDate: '2026-05-19',
  };

  it('shows destination and the computed day count', () => {
    const html = renderToString(
      <MemoryRouter>
        <TripCard trip={trip} onEdit={() => {}} onDelete={() => {}} />
      </MemoryRouter>,
    );
    expect(html).toContain('Lissabon');
    expect(html).toContain('8 Tage');
  });

  it('renders a link to the detail page', () => {
    const html = renderToString(
      <MemoryRouter>
        <TripCard trip={trip} onEdit={() => {}} onDelete={() => {}} />
      </MemoryRouter>,
    );
    expect(html).toContain('/trips/t1');
  });
});

describe('TripForm', () => {
  it('renders the create variant with an empty form', () => {
    const html = renderToString(<TripForm onSubmit={() => {}} onCancel={() => {}} />);
    expect(html).toContain('Neue Reise');
    expect(html).toContain('Reise anlegen');
  });

  it('renders the edit variant prefilled with the current values', () => {
    const trip: Trip = {
      id: 't1',
      destination: 'Lissabon',
      startDate: '2026-05-12',
      endDate: '2026-05-19',
    };
    const html = renderToString(
      <TripForm initial={trip} onSubmit={() => {}} onCancel={() => {}} />,
    );
    expect(html).toContain('Reise bearbeiten');
    expect(html).toContain('Speichern');
    expect(html).toContain('Lissabon');
  });
});

describe('ConfirmDialog', () => {
  const trip: Trip = {
    id: 't1',
    destination: 'Lissabon',
    startDate: '2026-05-12',
    endDate: '2026-05-19',
  };

  it('names the trip and offers confirm and cancel actions', () => {
    const html = renderToString(
      <ConfirmDialog trip={trip} onConfirm={() => {}} onCancel={() => {}} />,
    );
    expect(html).toContain('Reise löschen?');
    expect(html).toContain('Lissabon');
    expect(html).toContain('Löschen');
    expect(html).toContain('Abbrechen');
  });
});

describe('trips store integration', () => {
  it('addTrip returns a trip carrying the submitted draft', () => {
    let context: ReturnType<typeof useTrips> | null = null;
    function Harness() {
      context = useTrips();
      return null;
    }
    renderToString(
      <TripsProvider>
        <Harness />
      </TripsProvider>,
    );

    const draft: TripDraft = {
      destination: 'Rom',
      startDate: '2026-06-01',
      endDate: '2026-06-05',
    };
    const created = context!.addTrip(draft);
    expect(created.destination).toBe('Rom');
    expect(created.startDate).toBe('2026-06-01');
    expect(created.endDate).toBe('2026-06-05');
    expect(created.id).toBeTruthy();
  });

  it('exposes activities and packing items linked to a stored trip', () => {
    let context: ReturnType<typeof useTrips> | null = null;
    function Harness() {
      context = useTrips();
      return null;
    }
    seedStorage({
      trips: [{ id: 't1', destination: 'Rom', startDate: '2026-06-01', endDate: '2026-06-05' }],
      activities: [
        { id: 'a1', tripId: 't1', time: '10:00', place: 'Kolosseum', cost: 18, category: 'aktivitaet' },
      ],
      packingItems: [{ id: 'p1', tripId: 't1', name: 'Pass', packed: false }],
    });
    renderToString(
      <TripsProvider>
        <Harness />
      </TripsProvider>,
    );

    expect(context!.trips).toHaveLength(1);
    expect(context!.activities).toHaveLength(1);
    expect(context!.packingItems).toHaveLength(1);
    expect(context!.activities[0].tripId).toBe('t1');
    expect(context!.packingItems[0].tripId).toBe('t1');
  });
});
