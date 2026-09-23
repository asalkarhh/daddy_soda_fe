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
 * Format numeric value as Indian Rupee display (e.g., ₹500.00)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format bottle size in Litres (e.g., 5.00 L)
 */
export function formatBottleSize(litres: number | null | undefined): string {
  if (litres === null || litres === undefined || isNaN(litres)) {
    return '0.00 L';
  }
  return `${Number(litres).toFixed(2)} L`;
}
