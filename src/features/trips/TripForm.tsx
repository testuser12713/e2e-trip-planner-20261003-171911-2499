import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Trip, TripDraft } from '../../types';
import { validateTrip } from '../../utils/validation';

interface TripFormProps {
  initial?: Trip;
  onSubmit: (draft: TripDraft) => void;
  onCancel: () => void;
}

const MAX_DESTINATION_LENGTH = 100;
const FIELD_ORDER: readonly (keyof TripDraft)[] = [
  'destination',
  'startDate',
  'endDate',
] as const;

function toErrors(draft: TripDraft): Record<string, string> {
  const errors = validateTrip(draft);
  if (draft.destination.trim().length > MAX_DESTINATION_LENGTH) {
    errors.destination = `Das Ziel darf höchstens ${MAX_DESTINATION_LENGTH} Zeichen lang sein.`;
  }
  return errors;
}

export default function TripForm({ initial, onSubmit, onCancel }: TripFormProps) {
  const [destination, setDestination] = useState(initial?.destination ?? '');
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const destinationRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const isEdit = initial != null;
  const title = isEdit ? 'Reise bearbeiten' : 'Neue Reise';
  const submitLabel = isEdit ? 'Speichern' : 'Reise anlegen';

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  function focusFirstError(errorKeys: readonly string[]) {
    const refs: Record<string, React.RefObject<HTMLInputElement | null>> = {
      destination: destinationRef,
      startDate: startDateRef,
      endDate: endDateRef,
    };
    for (const field of FIELD_ORDER) {
      if (errorKeys.includes(field)) {
        refs[field].current?.focus();
        return;
      }
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const draft: TripDraft = { destination, startDate, endDate };
    const nextErrors = toErrors(draft);
    setErrors(nextErrors);
    const keys = Object.keys(nextErrors);
    if (keys.length > 0) {
      focusFirstError(keys);
      return;
    }
    onSubmit(draft);
  }

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-form-title"
      >
        <div className="modal__head">
          <h2 className="modal__title" id="trip-form-title">
            {title}
          </h2>
          <button
            className="icon-btn modal__close"
            type="button"
            onClick={onCancel}
            aria-label="Schließen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="trip-destination">
              Ziel
            </label>
            <input
              ref={destinationRef}
              className={`input${errors.destination ? ' input--error' : ''}`}
              type="text"
              id="trip-destination"
              placeholder="z. B. Lissabon"
              maxLength={MAX_DESTINATION_LENGTH}
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
            {errors.destination ? (
              <p className="field-error">{errors.destination}</p>
            ) : null}
          </div>
          <div className="field">
            <label className="field__label" htmlFor="trip-start">
              Startdatum
            </label>
            <input
              ref={startDateRef}
              className={`input${errors.startDate ? ' input--error' : ''}`}
              type="date"
              id="trip-start"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
            {errors.startDate ? (
              <p className="field-error">{errors.startDate}</p>
            ) : null}
          </div>
          <div className="field">
            <label className="field__label" htmlFor="trip-end">
              Enddatum
            </label>
            <input
              ref={endDateRef}
              className={`input${errors.endDate ? ' input--error' : ''}`}
              type="date"
              id="trip-end"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
            {errors.endDate ? <p className="field-error">{errors.endDate}</p> : null}
          </div>
          <div className="modal__actions">
            <button className="btn btn--secondary" type="button" onClick={onCancel}>
              Abbrechen
            </button>
            <button className="btn btn--primary" type="submit">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
