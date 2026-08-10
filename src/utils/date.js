import { locale } from './i18n';

const intlLocale = locale === 'it' ? 'it-IT' : 'en-GB';
const formatter = new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short' });

export function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return null;
  if (startDate && !endDate) return formatter.format(new Date(startDate));
  if (!startDate && endDate) return formatter.format(new Date(endDate));
  return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
}

export const MONTHS = locale === 'it'
  ? ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
     'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']
  : ['January', 'February', 'March', 'April', 'May', 'June',
     'July', 'August', 'September', 'October', 'November', 'December'];

// Monday-first
export const DAYS_SHORT = locale === 'it'
  ? ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do']
  : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function isoToDate(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function dateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLong(iso) {
  const date = isoToDate(iso);
  if (!date) return '';
  return locale === 'it'
    ? `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
    : `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Monday-first 6x7 grid of Date objects, spilling into adjacent months
export function getMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = Monday
  const start = new Date(year, month, 1 - firstWeekday);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
}
