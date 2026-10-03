import { useMemo, useState } from 'react';
import { useTrips } from '../../store/tripsStore';
import type { Trip, TripDraft } from '../../types';
import TripCard from './TripCard';
import TripForm from './TripForm';
import ConfirmDialog from './ConfirmDialog';
import './trips.css';

type FormState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; trip: Trip };

export default function TripListPage() {
  const { trips, addTrip, updateTrip, deleteTrip } = useTrips();
  const [form, setForm] = useState<FormState>({ mode: 'closed' });
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);

  const sortedTrips = useMemo(
    () => [...trips].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [trips],
  );

  function openCreate() {
    setForm({ mode: 'create' });
  }

  function handleSubmit(draft: TripDraft) {
    if (form.mode === 'edit') {
      updateTrip(form.trip.id, draft);
    } else {
      addTrip(draft);
    }
    setForm({ mode: 'closed' });
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Meine Reisen</h1>
          <p className="muted">Plane Tage, Budget und Packliste für deine nächsten Reisen.</p>
        </div>
        <button className="btn btn--primary" type="button" onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Neue Reise
        </button>
      </div>

      {sortedTrips.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <h2>Noch keine Reisen</h2>
          <p>Lege deine erste Reise an, um Tagesplan, Budget und Packliste zu verwalten.</p>
          <button className="btn btn--primary" type="button" onClick={openCreate}>
            Neue Reise
          </button>
        </div>
      ) : (
        <div className="trip-grid">
          {sortedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={() => setForm({ mode: 'edit', trip })}
              onDelete={() => setDeleteTarget(trip)}
            />
          ))}
        </div>
      )}

      {form.mode !== 'closed' ? (
        <TripForm
          key={form.mode === 'edit' ? form.trip.id : 'new'}
          initial={form.mode === 'edit' ? form.trip : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setForm({ mode: 'closed' })}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          trip={deleteTarget}
          onConfirm={() => {
            deleteTrip(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}
    </div>
  );
}
