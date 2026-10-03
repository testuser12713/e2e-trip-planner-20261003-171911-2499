import type { Category } from '../../types';
import { CATEGORIES } from '../../utils/budget';

const CATEGORY_LABELS: Record<Category, string> = {
  unterkunft: 'Unterkunft',
  transport: 'Transport',
  verpflegung: 'Verpflegung',
  aktivitaet: 'Aktivitäten',
  sonstiges: 'Sonstiges',
};

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

interface BudgetChartProps {
  byCategory: Record<Category, number>;
}

export default function BudgetChart({ byCategory }: BudgetChartProps) {
  const maxValue = CATEGORIES.reduce(
    (max, category) => Math.max(max, byCategory[category]),
    0,
  );

  return (
    <div className="card">
      {CATEGORIES.map((category) => {
        const value = byCategory[category];
        const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div key={category} className="budget-row">
            <div className="budget-row__head">
              <span className="budget-row__label">{CATEGORY_LABELS[category]}</span>
              <span className="budget-row__value">{formatCurrency(value)}</span>
            </div>
            <div
              className="budget-bar"
              role="img"
              aria-label={`${CATEGORY_LABELS[category]}: ${formatCurrency(value)}`}
            >
              <div className="budget-bar__fill" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
