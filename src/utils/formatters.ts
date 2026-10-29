/**
 * Format ISO date string to Indian-friendly format: DD MMM YYYY (e.g., 23 Sep 2026)
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}

/**
 * Format ISO date string to DD MMM YYYY, hh:mm A (e.g., 23 Sep 2026, 04:30 PM)
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    const datePart = new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);

    const timePart = new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);

    return `${datePart}, ${timePart}`;
  } catch {
    return '—';
  }
}

/**
 * Format ISO date string into date and time parts for stacked multiline display:
 * date: "29 Oct 2026,"
 * time: "04:35 pm"
 */
export function formatDateTimeParts(
  dateString: string | null | undefined
): { date: string; time: string } | null {
  if (!dateString) return null;
  const formatted = formatDateTime(dateString);
  if (!formatted || formatted === '—') return null;
  const commaIdx = formatted.indexOf(',');
  if (commaIdx !== -1) {
    return {
      date: formatted.substring(0, commaIdx + 1),
      time: formatted.substring(commaIdx + 1).trim(),
    };
  }
  return { date: formatted, time: '' };
}

/** Convert UUID-only audit fields into a readable actor label. */
export function formatActor(value: string | null | undefined, fallback = 'System Administrator'): string {
  if (!value) return fallback;
  return /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(value) ? 'Administrator' : value;
}

/**
 * Format numeric value as Indian Rupee display (e.g., ₹500 or ₹500.50)
 * Formats whole rupee amounts as clean integers without decimal fractions.
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  const num = Number(amount);
  const isInt = Number.isInteger(num);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: isInt ? 0 : 2,
  }).format(num);
}

/**
 * Format bottle size in Litres (e.g., 5 L or 1.50 L)
 */
export function formatBottleSize(litres: number | null | undefined): string {
  if (litres === null || litres === undefined || isNaN(litres)) {
    return '0 L';
  }
  const num = Number(litres);
  return `${Number.isInteger(num) ? num : num.toFixed(2)} L`;
}

/**
 * Format inventory / bottle quantity cleanly without unwanted decimal fractions on whole numbers.
 * E.g. 150 -> "150", 150.5 -> "150.5", or with unit: (150, 'Bottles') -> "150 Bottles"
 */
export function formatQuantity(qty: number | null | undefined, unit: string = ''): string {
  if (qty === null || qty === undefined || isNaN(qty)) {
    return unit ? `0 ${unit}` : '0';
  }
  const num = Number(qty);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return unit ? `${formatted} ${unit}` : formatted;
}
