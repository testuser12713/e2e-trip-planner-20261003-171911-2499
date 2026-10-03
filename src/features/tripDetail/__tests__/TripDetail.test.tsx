import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../../../store/storage';
import { TripsProvider } from '../../../store/tripsStore';
import TripDetailPage from '../TripDetailPage';

function seedStorage(data: unknown): void {
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (key === STORAGE_KEY ? JSON.stringify(data) : null),
    setItem: () => undefined,
    removeItem: () => undefined,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function render(path: string): string {
  return renderToString(
    <TripsProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/trips/:id" element={<TripDetailPage />}>
            <Route path="plan" element={<div data-outlet="plan" />} />
            <Route path="budget" element={<div data-outlet="budget" />} />
            <Route path="packing" element={<div data-outlet="packing" />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </TripsProvider>,
  );
}

const trips = [
  {
    id: 't1',
    destination: 'Lissabon',
    startDate: '2026-05-12',
    endDate: '2026-05-19',
  },
];

describe('TripDetailPage', () => {
  it('renders destination and date range in the header for a known trip', () => {
    seedStorage({ trips, activities: [], packingItems: [] });
    const html = render('/trips/t1/plan');

    expect(html).toContain('Lissabon');
    expect(html).toContain('19. Mai 2026');
    expect(html).toContain('Tage');
    expect(html).toMatch(/·\s*<!-- -->\s*8\s*<!-- -->\s*<!-- -->\s*Tage/);
  });

  it('renders a back link to the trip list', () => {
    seedStorage({ trips, activities: [], packingItems: [] });
    const html = render('/trips/t1/plan');

    expect(html).toContain('Meine Reisen');
    expect(html).toContain('href="/"');
  });

  it('renders the sub-navigation with plan, budget and packing', () => {
    seedStorage({ trips, activities: [], packingItems: [] });
    const html = render('/trips/t1/plan');

    expect(html).toContain('Tagesplan');
    expect(html).toContain('Budget');
    expect(html).toContain('Packliste');
  });

  it('highlights the active sub-navigation area', () => {
    seedStorage({ trips, activities: [], packingItems: [] });

    const planHtml = render('/trips/t1/plan');
    expect(planHtml).toMatch(/class="tab tab--active"[^>]*>Tagesplan<\/a>/);

    const budgetHtml = render('/trips/t1/budget');
    expect(budgetHtml).toMatch(/class="tab tab--active"[^>]*>Budget<\/a>/);

    const packingHtml = render('/trips/t1/packing');
    expect(packingHtml).toMatch(/class="tab tab--active"[^>]*>Packliste<\/a>/);
  });

  it('renders the nested route through the outlet', () => {
    seedStorage({ trips, activities: [], packingItems: [] });
    const html = render('/trips/t1/budget');

    expect(html).toContain('data-outlet="budget"');
  });

  it('shows the not-found page for an unknown trip id with a link back', () => {
    seedStorage({ trips, activities: [], packingItems: [] });
    const html = render('/trips/unknown/plan');

    expect(html).toContain('Reise nicht gefunden');
    expect(html).toContain('Zur Reiseliste');
    expect(html).toContain('href="/"');
  });
});
