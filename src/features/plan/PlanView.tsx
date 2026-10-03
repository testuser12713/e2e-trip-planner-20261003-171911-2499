import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTrips } from '../../store/tripsStore';
import type { Activity, ActivityDraft } from '../../types';
import { getDailyTotal, getDaysBetween, sortActivitiesByTime } from '../../utils/dates';
import ActivityForm from './ActivityForm';
import { categoryLabel, formatDay, formatEuro } from './planUtils';
import './plan.css';

type FormState = { mode: 'add'; day: string } | { mode: 'edit'; activity: Activity };

export default function PlanView() {
  const { id } = useParams<{ id: string }>();
  const { trips, activities, addActivity, updateActivity, deleteActivity } = useTrips();

  const [form, setForm] = useState<FormState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPendingDelete(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return <p className="muted">Reise nicht gefunden.</p>;
  }

  const days = getDaysBetween(trip.startDate, trip.endDate);

  const openAdd = () => {
    setForm({ mode: 'add', day: days[0] ?? '' });
  };

  const handleSubmit = (draft: ActivityDraft) => {
    if (form?.mode === 'edit') {
      updateActivity(form.activity.id, draft);
    } else {
      addActivity(trip.id, draft);
    }
    setForm(null);
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      deleteActivity(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  return (
    <section className="section">
      <div className="plan__head">
        <h2>Tagesplan</h2>
        <button className="btn btn--primary" type="button" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Aktivität hinzufügen
        </button>
      </div>

      <div>
        {days.map((day, index) => {
          const dayActivities = sortActivitiesByTime(
            activities.filter((activity) => activity.tripId === trip.id && activity.date === day),
          );
          const total = getDailyTotal(dayActivities);
          return (
            <section className="day" key={day}>
              <div className="day__head">
                <h3 className="day__title">
                  Tag {index + 1} · {formatDay(day)}
                </h3>
                <span className="day__total">{formatEuro(total)}</span>
              </div>
              {dayActivities.length === 0 ? (
                <div className="activity-list">
                  <p className="day__empty">Keine Aktivitäten geplant</p>
                </div>
              ) : (
                <div className="activity-list">
                  {dayActivities.map((activity) => (
                    <div className="activity card" key={activity.id}>
                      <span className="activity__time">{activity.time}</span>
                      <div className="activity__body">
                        <p className="activity__name">{activity.place}</p>
                        <div className="activity__meta">
                          <span className="badge">{categoryLabel(activity.category)}</span>
                          <span className="activity__cost">{formatEuro(activity.cost)}</span>
                        </div>
                      </div>
                      <div className="activity__actions">
                        <button
                          className="icon-btn"
                          type="button"
                          aria-label="Aktivität bearbeiten"
                          onClick={() => setForm({ mode: 'edit', activity })}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M4 20h4l11-11-4-4L4 16v4z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          className="icon-btn icon-btn--danger"
                          type="button"
                          aria-label="Aktivität löschen"
                          onClick={() => setPendingDelete(activity)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {form && (
        <ActivityForm
          days={days}
          defaultDay={form.mode === 'add' ? form.day : form.activity.date}
          activity={form.mode === 'edit' ? form.activity : null}
          onCancel={() => setForm(null)}
          onSubmit={handleSubmit}
        />
      )}

      {pendingDelete && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPendingDelete(null);
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-activity-title">
            <div className="modal__head">
              <h2 className="modal__title" id="delete-activity-title">Aktivität löschen?</h2>
              <button
                className="icon-btn modal__close"
                type="button"
                aria-label="Schließen"
                onClick={() => setPendingDelete(null)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p>Diese Aktivität wird dauerhaft entfernt.</p>
            <div className="modal__actions">
              <button className="btn btn--secondary" type="button" onClick={() => setPendingDelete(null)}>
                Abbrechen
              </button>
              <button className="btn btn--danger" type="button" onClick={confirmDelete}>
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
