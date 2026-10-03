import { Link } from 'react-router-dom';

export default function TripNotFoundPage() {
  return (
    <div className="empty-state not-found">
      <span className="empty-state__icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 9h.01M15 9h.01"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M9 14c.6.6 1.6 1 3 1s2.4-.4 3-1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <h2 className="not-found__title">Reise nicht gefunden</h2>
      <p>
        Diese Reise existiert nicht. Sie wurde möglicherweise gelöscht oder die Adresse
        ist nicht korrekt.
      </p>
      <Link className="btn btn--primary" to="/">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Zur Reiseliste
      </Link>
    </div>
  );
}
