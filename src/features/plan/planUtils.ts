import type { Category } from '../../types';

export const CATEGORY_OPTIONS: readonly { value: Category; label: string }[] = [
  { value: 'unterkunft', label: 'Unterkunft' },
  { value: 'transport', label: 'Transport' },
  { value: 'verpflegung', label: 'Verpflegung' },
  { value: 'aktivitaet', label: 'Aktivität' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

export function categoryLabel(category: Category): string {
  return CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function formatDay(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return date.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDayShort(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatEuro(value: number): string {
  const [integer, decimals] = value.toFixed(2).split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${grouped},${decimals} €`;
}
