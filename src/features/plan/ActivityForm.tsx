import { useEffect, useState, type FormEvent } from 'react';
import type { Activity, ActivityDraft, Category } from '../../types';
import { validateActivity } from '../../utils/validation';
import { CATEGORY_OPTIONS, formatDayShort } from './planUtils';

interface ActivityFormProps {
  days: string[];
  defaultDay: string;
  activity: Activity | null;
  onCancel: () => void;
  onSubmit: (draft: ActivityDraft) => void;
}

export default function ActivityForm({
  days,
  defaultDay,
  activity,
  onCancel,
  onSubmit,
}: ActivityFormProps) {
  const [date, setDate] = useState(activity?.date ?? defaultDay);
  const [time, setTime] = useState(activity?.time ?? '');
  const [place, setPlace] = useState(activity?.place ?? '');
  const [cost, setCost] = useState(activity ? String(activity.cost) : '0');
  const [category, setCategory] = useState<Category>(activity?.category ?? 'aktivitaet');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const costValue = cost.trim() === '' ? Number.NaN : Number(cost);
    const draft: ActivityDraft = {
      date,
      time,
      place: place.trim(),
      cost: costValue,
      category,
    };
    const nextErrors = validateActivity(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(draft);
  };

  const fieldClass = (name: string) => `input${errors[name] ? ' input--error' : ''}`;

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="activity-form-title">
        <div className="modal__head">
          <h2 className="modal__title" id="activity-form-title">
            {activity ? 'Aktivität bearbeiten' : 'Aktivität hinzufügen'}
          </h2>
          <button className="icon-btn modal__close" type="button" aria-label="Schließen" onClick={onCancel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="act-day">Tag</label>
            <select
              id="act-day"
              className={fieldClass('date')}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            >
              {days.map((day, index) => (
                <option key={day} value={day}>
                  Tag {index + 1} · {formatDayShort(day)}
                </option>
              ))}
            </select>
            {errors.date && <p className="field-error">{errors.date}</p>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="act-time">Uhrzeit</label>
            <input
              id="act-time"
              className={fieldClass('time')}
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
            {errors.time && <p className="field-error">{errors.time}</p>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="act-place">Ort</label>
            <input
              id="act-place"
              className={fieldClass('place')}
              type="text"
              maxLength={120}
              placeholder="z. B. Alfama"
              value={place}
              onChange={(event) => setPlace(event.target.value)}
            />
            {errors.place && <p className="field-error">{errors.place}</p>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="act-cost">Kosten (€)</label>
            <input
              id="act-cost"
              className={fieldClass('cost')}
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
            />
            {errors.cost && <p className="field-error">{errors.cost}</p>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="act-category">Kategorie</label>
            <select
              id="act-category"
              className={fieldClass('category')}
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="field-error">{errors.category}</p>}
          </div>

          <div className="modal__actions">
            <button className="btn btn--secondary" type="button" onClick={onCancel}>
              Abbrechen
            </button>
            <button className="btn btn--primary" type="submit">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
