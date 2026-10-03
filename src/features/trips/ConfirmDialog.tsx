import { useEffect } from 'react';
import type { Trip } from '../../types';

interface ConfirmDialogProps {
  trip: Trip;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ trip, onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-trip-title"
      >
        <div className="modal__head">
          <h2 className="modal__title" id="delete-trip-title">
            Reise löschen?
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
        <p>
          „<strong>{trip.destination}</strong>“ wird samt zugehöriger Aktivitäten und
          Packlisteneinträge dauerhaft entfernt.
        </p>
        <div className="modal__actions">
          <button className="btn btn--secondary" type="button" onClick={onCancel}>
            Abbrechen
          </button>
          <button className="btn btn--danger" type="button" onClick={onConfirm}>
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
