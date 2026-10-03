import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTrips } from '../../store/tripsStore';
import { getBudgetByCategory } from '../../utils/budget';
import BudgetChart, { formatCurrency } from './BudgetChart';

export default function BudgetView() {
  const { id } = useParams<{ id: string }>();
  const { activities } = useTrips();

  const { byCategory, total } = useMemo(() => {
    const tripActivities = activities.filter((activity) => activity.tripId === id);
    return getBudgetByCategory(tripActivities);
  }, [activities, id]);

  return (
    <section className="budget">
      <h2 className="budget__heading">Budget-Übersicht</h2>
      <div className="budget-total">
        <span className="budget-total__label">Gesamtsumme</span>
        <span className="budget-total__value">{formatCurrency(total)}</span>
      </div>
      <BudgetChart byCategory={byCategory} />
      <p className="muted small budget__note">
        Die Balkenlängen sind proportional zum größten Kategoriewert. Die Übersicht
        aktualisiert sich automatisch, sobald du im Tagesplan Aktivitäten anlegst,
        änderst oder löschst.
      </p>
    </section>
  );
}
