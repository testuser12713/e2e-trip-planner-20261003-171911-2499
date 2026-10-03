import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Activity, ActivityDraft, PackingItem, Trip, TripDraft } from '../types';
import { loadTripsData, saveTripsData, type TripsData } from './storage';

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface TripsContextValue {
  trips: Trip[];
  activities: Activity[];
  packingItems: PackingItem[];
  addTrip(draft: TripDraft): Trip;
  updateTrip(id: string, draft: TripDraft): void;
  deleteTrip(id: string): void;
  addActivity(tripId: string, draft: ActivityDraft): Activity;
  updateActivity(id: string, draft: ActivityDraft): void;
  deleteActivity(id: string): void;
  addPackingItem(tripId: string, name: string): PackingItem;
  updatePackingItem(id: string, patch: Partial<PackingItem>): void;
  deletePackingItem(id: string): void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TripsData>(() => loadTripsData());

  useEffect(() => {
    saveTripsData(state);
  }, [state]);

  const value = useMemo<TripsContextValue>(() => {
    const addTrip = (draft: TripDraft): Trip => {
      const trip: Trip = {
        id: createId('trip'),
        destination: draft.destination,
        startDate: draft.startDate,
        endDate: draft.endDate,
      };
      setState((prev) => ({ ...prev, trips: [...prev.trips, trip] }));
      return trip;
    };

    const updateTrip = (id: string, draft: TripDraft): void => {
      setState((prev) => ({
        ...prev,
        trips: prev.trips.map((trip) =>
          trip.id === id
            ? {
                ...trip,
                destination: draft.destination,
                startDate: draft.startDate,
                endDate: draft.endDate,
              }
            : trip,
        ),
      }));
    };

    const deleteTrip = (id: string): void => {
      setState((prev) => ({
        trips: prev.trips.filter((trip) => trip.id !== id),
        activities: prev.activities.filter((activity) => activity.tripId !== id),
        packingItems: prev.packingItems.filter((item) => item.tripId !== id),
      }));
    };

    const addActivity = (tripId: string, draft: ActivityDraft): Activity => {
      const activity: Activity = {
        id: createId('activity'),
        tripId,
        date: draft.date,
        time: draft.time,
        place: draft.place,
        cost: draft.cost,
        category: draft.category,
      };
      setState((prev) => ({ ...prev, activities: [...prev.activities, activity] }));
      return activity;
    };

    const updateActivity = (id: string, draft: ActivityDraft): void => {
      setState((prev) => ({
        ...prev,
        activities: prev.activities.map((activity) =>
          activity.id === id
            ? {
                ...activity,
                date: draft.date,
                time: draft.time,
                place: draft.place,
                cost: draft.cost,
                category: draft.category,
              }
            : activity,
        ),
      }));
    };

    const deleteActivity = (id: string): void => {
      setState((prev) => ({
        ...prev,
        activities: prev.activities.filter((activity) => activity.id !== id),
      }));
    };

    const addPackingItem = (tripId: string, name: string): PackingItem => {
      const item: PackingItem = {
        id: createId('packing'),
        tripId,
        name,
        packed: false,
      };
      setState((prev) => ({ ...prev, packingItems: [...prev.packingItems, item] }));
      return item;
    };

    const updatePackingItem = (id: string, patch: Partial<PackingItem>): void => {
      setState((prev) => ({
        ...prev,
        packingItems: prev.packingItems.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      }));
    };

    const deletePackingItem = (id: string): void => {
      setState((prev) => ({
        ...prev,
        packingItems: prev.packingItems.filter((item) => item.id !== id),
      }));
    };

    return {
      trips: state.trips,
      activities: state.activities,
      packingItems: state.packingItems,
      addTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      updateActivity,
      deleteActivity,
      addPackingItem,
      updatePackingItem,
      deletePackingItem,
    };
  }, [state]);

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips(): TripsContextValue {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripsProvider');
  }
  return context;
}
