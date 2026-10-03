// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { TripsProvider, useTrips } from '../../../store/tripsStore';
import BudgetView from '../BudgetView';
import { formatCurrency } from '../BudgetChart';
import type { Activity, Trip } from '../../../types';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: 't1' }),
}));

const STORAGE_KEY = 'trips.v1';

function seedLocalStorage(): void {
  const trip: Trip = {
    id: 't1',
    destination: 'Lissabon',
    startDate: '2026-05-12',
    endDate: '2026-05-19',
  };
  const activities: Activity[] = [
    { id: 'a1', tripId: 't1', time: '10:00', place: 'Hotel', cost: 120, category: 'unterkunft' },
    { id: 'a2', tripId: 't1', time: '11:00', place: 'Hotel', cost: 80, category: 'unterkunft' },
    { id: 'a3', tripId: 't1', time: '12:00', place: 'Zug', cost: 100, category: 'transport' },
    { id: 'a4', tripId: 't1', time: '13:00', place: 'Bistro', cost: 50, category: 'verpflegung' },
    { id: 'a5', tripId: 't1', time: '14:00', place: 'Museum', cost: 25, category: 'aktivitaet' },
  ];
  const store = new Map<string, string>();
  store.set(
    STORAGE_KEY,
    JSON.stringify({ trips: [trip], activities, packingItems: [] }),
  );
  const storage = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
  vi.stubGlobal('localStorage', storage);
}

function Harness() {
  const { addActivity, updateActivity, deleteActivity } = useTrips();
  return (
    <div>
      <BudgetView />
      <button
        onClick={() =>
          addActivity('t1', {
            time: '15:00',
            place: 'Extra',
            cost: 400,
            category: 'sonstiges',
          })
        }
      >
        add
      </button>
      <button
        onClick={() =>
          updateActivity('a1', {
            time: '10:00',
            place: 'Hotel',
            cost: 300,
            category: 'unterkunft',
          })
        }
      >
        update
      </button>
      <button onClick={() => deleteActivity('a3')}>delete</button>
    </div>
  );
}

interface RowView {
  value: string;
  width: number;
}

function readRows(container: HTMLElement): RowView[] {
  const rows = container.querySelectorAll('.budget-row');
  return Array.from(rows).map((row) => {
    const value = row.querySelector('.budget-row__value')?.textContent ?? '';
    const fill = row.querySelector('.budget-bar__fill') as HTMLElement | null;
    const width = fill ? Number.parseFloat(fill.style.width) : NaN;
    return { value, width };
  });
}

beforeEach(() => {
  seedLocalStorage();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('BudgetView', () => {
  it('shows the correct sum per category and total with proportional bars', () => {
    const { container } = render(
      <TripsProvider>
        <Harness />
      </TripsProvider>,
    );

    const total = container.querySelector('.budget-total__value')?.textContent;
    expect(total).toBe(formatCurrency(375));

    const rows = readRows(container);
    expect(rows).toHaveLength(5);

    // CATEGORIES order: unterkunft, transport, verpflegung, aktivitaet, sonstiges
    expect(rows[0]).toEqual({ value: formatCurrency(200), width: 100 });
    expect(rows[1]).toEqual({ value: formatCurrency(100), width: 50 });
    expect(rows[2]).toEqual({ value: formatCurrency(50), width: 25 });
    expect(rows[3]).toEqual({ value: formatCurrency(25), width: 12.5 });
    expect(rows[4]).toEqual({ value: formatCurrency(0), width: 0 });
  });

  it('renders zero-cost categories as zero bars', () => {
    const { container } = render(
      <TripsProvider>
        <BudgetView />
      </TripsProvider>,
    );

    const rows = readRows(container);
    expect(rows[4]).toEqual({ value: formatCurrency(0), width: 0 });
  });

  it('updates immediately after an activity is added', () => {
    const { container, getByText } = render(
      <TripsProvider>
        <Harness />
      </TripsProvider>,
    );

    fireEvent.click(getByText('add'));

    const total = container.querySelector('.budget-total__value')?.textContent;
    expect(total).toBe(formatCurrency(775));

    const rows = readRows(container);
    // sonstiges becomes the largest category (400)
    expect(rows[4]).toEqual({ value: formatCurrency(400), width: 100 });
    expect(rows[0]).toEqual({ value: formatCurrency(200), width: 50 });
  });

  it('updates immediately after an activity is changed', () => {
    const { container, getByText } = render(
      <TripsProvider>
        <Harness />
      </TripsProvider>,
    );

    fireEvent.click(getByText('update'));

    const total = container.querySelector('.budget-total__value')?.textContent;
    // unterkunft was 200 (120 + 80); a1 goes 120 -> 300, so 380, total 555
    expect(total).toBe(formatCurrency(555));

    const rows = readRows(container);
    expect(rows[0]).toEqual({ value: formatCurrency(380), width: 100 });
  });

  it('updates immediately after an activity is deleted', () => {
    const { container, getByText } = render(
      <TripsProvider>
        <Harness />
      </TripsProvider>,
    );

    fireEvent.click(getByText('delete'));

    const total = container.querySelector('.budget-total__value')?.textContent;
    // transport (100) removed from 375
    expect(total).toBe(formatCurrency(275));

    const rows = readRows(container);
    expect(rows[1]).toEqual({ value: formatCurrency(0), width: 0 });
    expect(rows[0]).toEqual({ value: formatCurrency(200), width: 100 });
  });
});
