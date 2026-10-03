import type { Activity } from '../types';

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysBetween(startDate: string, endDate: string): string[] {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  if (!start || !end || end.getTime() < start.getTime()) {
    return [];
  }
  const days: string[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    days.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function sortActivitiesByTime(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => a.time.localeCompare(b.time));
}

export function getDailyTotal(activities: Activity[]): number {
  return round2(activities.reduce((sum, activity) => sum + activity.cost, 0));
}
