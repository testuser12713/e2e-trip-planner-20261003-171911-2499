import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PackingView, { packingProgress } from '../PackingView';
import { TripsProvider } from '../../../store/tripsStore';
import { STORAGE_KEY } from '../../../store/storage';
import type { PackingItem } from '../../../types';

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

function seedPackingItems(items: PackingItem[]): void {
  const storage = globalThis.localStorage as MemoryStorage;
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ trips: [], activities: [], packingItems: items }),
  );
}

function item(
  id: string,
  tripId: string,
  name: string,
  packed: boolean,
): PackingItem {
  return { id, tripId, name, packed };
}

function renderPacking(tripId: string): string {
  return renderToStaticMarkup(
    <TripsProvider>
      <MemoryRouter initialEntries={[`/trips/${tripId}/packing`]}>
        <Routes>
          <Route path="/trips/:id/packing" element={<PackingView />} />
        </Routes>
      </MemoryRouter>
    </TripsProvider>,
  );
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createMemoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('packingProgress', () => {
  it('counts total and packed', () => {
    const items = [
      item('p1', 't1', 'Pass', true),
      item('p2', 't1', 'Adapter', false),
      item('p3', 't1', 'Schuhe', true),
    ];
    expect(packingProgress(items)).toEqual({ total: 3, packed: 2 });
  });

  it('returns zeroes for an empty list', () => {
    expect(packingProgress([])).toEqual({ total: 0, packed: 0 });
  });
});

describe('PackingView', () => {
  it('shows the progress indicator "x von y gepackt"', () => {
    seedPackingItems([
      item('p1', 't1', 'Reisepass', true),
      item('p2', 't1', 'Bordkarten', true),
      item('p3', 't1', 'Reiseadapter', false),
      item('p4', 't1', 'Wanderschuhe', false),
    ]);
    const html = renderPacking('t1');
    expect(html).toContain('2 von 4 gepackt');
    expect(html).toContain('50 %');
  });

  it('keeps open and packed entries visibly separated', () => {
    seedPackingItems([
      item('p1', 't1', 'Reisepass', true),
      item('p2', 't1', 'Reiseadapter', false),
    ]);
    const html = renderPacking('t1');
    expect(html).toContain('Offen');
    expect(html).toContain('Gepackt');

    const openIndex = html.indexOf('Reiseadapter');
    const packedIndex = html.indexOf('Reisepass');
    const doneHeadingIndex = html.indexOf('Gepackt');

    expect(openIndex).toBeGreaterThan(-1);
    expect(packedIndex).toBeGreaterThan(-1);
    expect(doneHeadingIndex).toBeGreaterThan(-1);
    expect(openIndex).toBeLessThan(doneHeadingIndex);
    expect(packedIndex).toBeGreaterThan(doneHeadingIndex);
  });

  it('reflects a toggled (packed) item in the progress count', () => {
    seedPackingItems([
      item('p1', 't1', 'Reisepass', false),
      item('p2', 't1', 'Reiseadapter', false),
    ]);
    const before = renderPacking('t1');
    expect(before).toContain('0 von 2 gepackt');

    seedPackingItems([
      item('p1', 't1', 'Reisepass', true),
      item('p2', 't1', 'Reiseadapter', false),
    ]);
    const after = renderPacking('t1');
    expect(after).toContain('1 von 2 gepackt');
    expect(after).toContain('50 %');
  });

  it('shows an empty state when there are no entries', () => {
    seedPackingItems([]);
    const html = renderPacking('t1');
    expect(html).toContain('0 von 0 gepackt');
    expect(html).toContain('Noch keine Einträge');
  });

  it('only lists entries belonging to the current trip', () => {
    seedPackingItems([
      item('p1', 't1', 'Reisepass', true),
      item('p2', 't2', 'Badesachen', false),
    ]);
    const html = renderPacking('t1');
    expect(html).toContain('Reisepass');
    expect(html).not.toContain('Badesachen');
    expect(html).toContain('1 von 1 gepackt');
  });
});
