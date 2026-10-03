import { Link } from 'react-router-dom';
import type { Trip } from '../../types';
import { getDaysBetween } from '../../utils/dates';

interface TripCardProps {
  trip: Trip;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const dayCount = getDaysBetween(trip.startDate, trip.endDate).length;
  const dayLabel = `${dayCount} ${dayCount === 1 ? 'Tag' : 'Tage'}`;

  return (
    <article className="card trip-card">
      <Link className="trip-card__link" to={`/trips/${trip.id}`}>
        <h3 className="trip-card__title">{trip.destination}</h3>
        <p className="trip-card__dates">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </p>
        <div className="trip-card__meta">
          <span className="badge">{dayLabel}</span>
        </div>
      </Link>
      <div className="trip-card__actions">
        <button
          className="icon-btn"
          type="button"
          onClick={onEdit}
          aria-label={`Reise „${trip.destination}“ bearbeiten`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="icon-btn icon-btn--danger"
          type="button"
          onClick={onDelete}
          aria-label={`Reise „${trip.destination}“ löschen`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
