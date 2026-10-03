import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { useTrips } from '../../store/tripsStore';
import { getDaysBetween } from '../../utils/dates';
import TripNotFoundPage from './TripNotFoundPage';
import './tripDetail.css';

function parseISOParts(iso: string): [number, number, number] | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function formatStartDate(iso: string): string {
  const parts = parseISOParts(iso);
  if (!parts) return iso;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
  });
}

function formatEndDate(iso: string): string {
  const parts = parseISOParts(iso);
  if (!parts) return iso;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function TripDetailPage() {
  const { id } = useParams();
  const { trips } = useTrips();
  const trip = trips.find((candidate) => candidate.id === id);

  if (!trip) {
    return <TripNotFoundPage />;
  }

  const dayCount = getDaysBetween(trip.startDate, trip.endDate).length;
  const dayLabel = dayCount === 1 ? 'Tag' : 'Tage';

  const tabClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'tab tab--active' : 'tab';

  return (
    <>
      <Link className="crumb" to="/">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Meine Reisen
      </Link>

      <div className="trip-hero">
        <div>
          <h1>{trip.destination}</h1>
          <p className="trip-hero__meta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {formatStartDate(trip.startDate)} – {formatEndDate(trip.endDate)} · {dayCount}{' '}
            {dayLabel}
          </p>
        </div>
      </div>

      <nav className="tabs" aria-label="Reise-Navigation">
        <NavLink to="plan" className={tabClassName}>
          Tagesplan
        </NavLink>
        <NavLink to="budget" className={tabClassName}>
          Budget
        </NavLink>
        <NavLink to="packing" className={tabClassName}>
          Packliste
        </NavLink>
      </nav>

      <Outlet />
    </>
  );
}
