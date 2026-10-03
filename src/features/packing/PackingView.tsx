import { useParams } from 'react-router-dom';
import { useTrips } from '../../store/tripsStore';
import type { PackingItem } from '../../types';
import PackingForm from './PackingForm';
import './packing.css';

export interface PackingProgress {
  total: number;
  packed: number;
}

export function packingProgress(items: PackingItem[]): PackingProgress {
  return {
    total: items.length,
    packed: items.filter((item) => item.packed).length,
  };
}

interface PackingItemRowProps {
  item: PackingItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function PackingItemRow({ item, onToggle, onDelete }: PackingItemRowProps) {
  return (
    <li
      className={`pack-item${item.packed ? ' pack-item--done' : ''}`}
      data-testid={`pack-item-${item.id}`}
    >
      <label>
        <input
          type="checkbox"
          checked={item.packed}
          onChange={() => onToggle(item.id)}
          aria-label={item.name}
        />
        <span>{item.name}</span>
      </label>
      <button
        className="icon-btn icon-btn--danger"
        type="button"
        aria-label={`${item.name} löschen`}
        onClick={() => onDelete(item.id)}
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
    </li>
  );
}

export default function PackingView() {
  const { id: tripId } = useParams<{ id: string }>();
  const { packingItems, addPackingItem, updatePackingItem, deletePackingItem } =
    useTrips();

  const items = packingItems.filter((item) => item.tripId === tripId);
  const { total, packed } = packingProgress(items);
  const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

  const openItems = items.filter((item) => !item.packed);
  const doneItems = items.filter((item) => item.packed);

  function handleAdd(name: string) {
    if (!tripId) return;
    addPackingItem(tripId, name);
  }

  function handleToggle(id: string) {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;
    updatePackingItem(id, { packed: !item.packed });
  }

  return (
    <section className="section">
      <h2 className="packing-heading">Packliste</h2>

      <div className="card pack-progress">
        <div className="pack-progress__head">
          <span className="progress-label" data-testid="progress-label">
            {packed} von {total} gepackt
          </span>
          <span className="progress-label" data-testid="progress-percent">
            {percent} %
          </span>
        </div>
        <div className="progress">
          <div
            className="progress__fill"
            style={{ width: `${percent}%` }}
            data-testid="progress-fill"
          />
        </div>
      </div>

      <PackingForm onSubmit={handleAdd} />

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6h11M9 12h11M9 18h11M4 6l1 1-1 1M4 12l1 1-1 1M4 18l1 1-1 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Noch keine Einträge</h2>
          <p>Lege oben den ersten Eintrag für deine Packliste an.</p>
        </div>
      ) : (
        <>
          {openItems.length > 0 && (
            <div className="pack-group">
              <h3 className="pack-group__title">Offen</h3>
              <ul className="pack-list">
                {openItems.map((item) => (
                  <PackingItemRow
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                    onDelete={deletePackingItem}
                  />
                ))}
              </ul>
            </div>
          )}
          {doneItems.length > 0 && (
            <div className="pack-group">
              <h3 className="pack-group__title">Gepackt</h3>
              <ul className="pack-list">
                {doneItems.map((item) => (
                  <PackingItemRow
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                    onDelete={deletePackingItem}
                  />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
