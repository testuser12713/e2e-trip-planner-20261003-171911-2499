export type Category =
  | 'unterkunft'
  | 'transport'
  | 'verpflegung'
  | 'aktivitaet'
  | 'sonstiges';

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export interface Activity {
  id: string;
  tripId: string;
  time: string;
  place: string;
  cost: number;
  category: Category;
}

export interface PackingItem {
  id: string;
  tripId: string;
  name: string;
  packed: boolean;
}

export interface TripDraft {
  destination: string;
  startDate: string;
  endDate: string;
}

export interface ActivityDraft {
  time: string;
  place: string;
  cost: number;
  category: Category;
}
