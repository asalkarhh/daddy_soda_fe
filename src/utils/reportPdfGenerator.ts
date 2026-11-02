import { formatCurrency, formatQuantity, formatDate } from './formatters';

// Configuration constants
const COMPANY_NAME = 'Daddy Soda House';
const COMPANY_LEGAL = 'Himmat Beverages Pvt. Ltd.';
const COMPANY_ADDRESS = 'Shop 12, Phoenix Marketcity, Viman Nagar, Pune, Maharashtra 411014';

/**
 * Robust RFC 4180-compliant CSV parser.
 * Handles escaped quotes (""), commas inside quotes, CRLF/LF newlines, and leading formula guards (').
 */
export function parseCsv(csvText: string): string[][] {
  if (!csvText) return [];
  // Strip UTF-8 BOM if present
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(cleanCell(currentCell));
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
      currentRow.push(cleanCell(currentCell));
      currentCell = '';
      if (currentRow.length > 0 && currentRow.some((c) => c !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  // Push final cell and row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(cleanCell(currentCell));
    if (currentRow.some((c) => c !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function cleanCell(val: string): string {
  let trimmed = val.trim();
  // Strip single quote prepended by backend to prevent spreadsheet formula injection
  if (trimmed.startsWith("'") && trimmed.length > 1) {
    trimmed = trimmed.substring(1);
  }
  return trimmed;
}

function parseNumber(val: string | undefined): number {
  if (!val) return 0;
  const num = parseFloat(val.replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

export function formatMonthName(monthStr: string): string {
  if (!monthStr) return '';
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(year) || isNaN(month)) return monthStr;
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function getBaseStyles(): string {
  return `
    body { font-family: Arial, sans-serif; color: #172033; padding: 28px; background: #fff; margin: 0; }
    h1 { color: #0f766e; margin-bottom: 4px; font-size: 24px; font-weight: bold; }
    h2 { margin-top: 0; font-weight: normal; font-size: 18px; color: #1e293b; }
    p { color: #64748b; margin-top: 4px; font-size: 13px; line-height: 1.5; }
    .summary { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; }
    .box { border: 1px solid #cbd5e1; padding: 12px 16px; min-width: 150px; border-radius: 4px; font-size: 13px; color: #475569; background: #fff; }
    .box b { font-size: 16px; color: #0f172a; display: block; margin-top: 4px; }
    .toolbar { margin: 18px 0; text-align: right; }
    button { background: #0f766e; color: white; border: 0; border-radius: 5px; padding: 9px 16px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s ease-in-out; }
    button:hover { background: #115e59; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12.5px; }
    th, td { border: 1px solid #cbd5e1; padding: 9px 10px; text-align: left; vertical-align: middle; }
    th { background: #f1f5f9; font-weight: 600; color: #1e293b; }
    tr:nth-child(even) { background: #fafbfc; }
    tfoot tr { background: #f1f5f9 !important; font-weight: bold; border-top: 2px solid #cbd5e1; }
    tfoot td { padding: 10px; font-weight: bold; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
    .badge-paid { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
    .badge-partial { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .badge-pending { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-info { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
    .financial-summary-wrapper { display: flex; justify-content: flex-end; margin-top: 24px; page-break-inside: avoid; }
    .financial-summary-card { border: 1px solid #cbd5e1; border-radius: 6px; min-width: 350px; background: #fff; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .financial-summary-header { background: #f1f5f9; padding: 10px 16px; font-weight: bold; font-size: 13px; color: #1e293b; border-bottom: 1px solid #cbd5e1; }
    .financial-summary-body { padding: 14px 16px; font-size: 13px; display: flex; flex-direction: column; gap: 10px; }
    .calc-row { display: flex; justify-content: space-between; align-items: center; }
    .calc-row span { color: #475569; }
    .calc-row.calc-total { border-top: 1px dashed #cbd5e1; padding-top: 10px; margin-top: 2px; }
    .calc-row.calc-total span { font-weight: bold; color: #1e293b; }
    @media print {
      .toolbar { display: none !important; }
      body { padding: 0 !important; margin: 10mm !important; }
      @page { size: landscape; margin: 10mm; }
    }
  `;
}

export function openPrintWindow(html: string): boolean {
  const win = window.open('', '_blank', 'width=1100,height=800');
  if (!win) {
    return false;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  return true;
}

/**
 * 1. Generate Monthly Purchases Report PDF View
 */
export function generatePurchasesReportPdf(
  csvText: string,
  params: { month: string; supplierId?: string },
  extraMeta?: { supplierName?: string }
): boolean {
  const parsed = parseCsv(csvText);
  const dataRows = parsed.slice(1);
  const monthName = formatMonthName(params.month);

  const uniqueBills = new Set(dataRows.map((r) => r[0]).filter(Boolean));
  const uniqueSuppliers = new Set(dataRows.map((r) => r[2]).filter(Boolean));
  const totalQuantity = dataRows.reduce((sum, r) => sum + parseNumber(r[7]), 0);

  const filterSubtitleParts = [monthName];
  if (extraMeta?.supplierName) {
    filterSubtitleParts.push(extraMeta.supplierName);
  }

  const tableRowsHtml = dataRows.length
    ? dataRows
        .map((r) => {
          const purchaseNo = r[0] || '—';
          const billDate = formatDate(r[1]);
          const supplier = r[2] || '—';
          const supplierBill = r[3] ? `Ref: ${r[3]}` : '—';
          const flavour = r[5] || r[4] || '—';
          const bottleSize = r[6] ? `${r[6]} L` : '—';
          const quantity = formatQuantity(parseNumber(r[7]));
          const status = r[8] || 'RECEIVED';

          return `<tr>
            <td class="text-center">${billDate}</td>
            <td class="font-mono"><b>${purchaseNo}</b></td>
            <td><b>${supplier}</b><br><small style="color:#64748b">${supplierBill}</small></td>
            <td>${flavour}</td>
            <td class="text-center">${bottleSize}</td>
            <td class="text-right"><b>${quantity}</b></td>
            <td class="text-center"><span class="badge badge-info">${status}</span></td>
          </tr>`;
        })
        .join('')
    : '<tr><td colspan="7" class="text-center" style="padding:28px;color:#64748b;">No purchases recorded for this billing cycle.</td></tr>';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Monthly Purchases Report - ${monthName} - ${COMPANY_NAME}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <h1>${COMPANY_NAME}</h1>
  <h2>Monthly Purchases Report · ${filterSubtitleParts.join(' · ')}</h2>
  <p>${COMPANY_LEGAL} · ${COMPANY_ADDRESS}<br>Official Procurement & Warehouse Inward Statement</p>

  <div class="summary">
    <div class="box">Total Purchase Bills<br><b>${uniqueBills.size}</b></div>
    <div class="box">Total Line Items<br><b>${dataRows.length}</b></div>
    <div class="box">Total Quantity Inward<br><b>${formatQuantity(totalQuantity, 'Units')}</b></div>
    <div class="box">Suppliers Involved<br><b>${uniqueSuppliers.size}</b></div>
  </div>

  <div class="toolbar">
    <button onclick="window.print()">Download PDF / Print</button>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center">Bill Date</th>
        <th>Purchase Number</th>
        <th>Supplier & Bill Ref</th>
        <th>Flavour / Product</th>
        <th class="text-center">Bottle Size</th>
        <th class="text-right">Quantity</th>
        <th class="text-center">Status</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
    ${
      dataRows.length
        ? `<tfoot>
            <tr>
              <td colspan="5" class="text-right"><b>Total Quantity:</b></td>
              <td class="text-right"><b>${formatQuantity(totalQuantity, 'Units')}</b></td>
              <td></td>
            </tr>
          </tfoot>`
        : ''
    }
  </table>

  <div class="financial-summary-wrapper">
    <div class="financial-summary-card">
      <div class="financial-summary-header">Procurement Summary Calculation</div>
      <div class="financial-summary-body">
        <div class="calc-row">
          <span>Total Purchase Bills:</span>
          <b>${uniqueBills.size}</b>
        </div>
        <div class="calc-row">
          <span>Total Product Line Items:</span>
          <b>${dataRows.length}</b>
        </div>
        <div class="calc-row calc-total">
          <span>Total Inward Quantity:</span>
          <b style="color:#0f766e; font-size:14px;">${formatQuantity(totalQuantity, 'Units')}</b>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return openPrintWindow(html);
}

/**
 * 2. Generate Monthly Sales Orders Report PDF View
 * Operational summary: Total Orders, Total Quantity, Total Order Valuation, and Active Franchises.
 * (Payments & dues are tracked exclusively in Monthly Invoices & Due Payments reports).
 */
export function generateOrdersReportPdf(
  csvText: string,
  params: { month: string; franchiseId?: string; orderStatus?: string },
  extraMeta?: { franchiseName?: string }
): boolean {
  const parsed = parseCsv(csvText);
  const dataRows = parsed.slice(1);
  const monthName = formatMonthName(params.month);

  // Group by distinct order number to calculate accurate order counts and valuations
  const orderMap = new Map<
    string,
    {
      orderNo: string;
      orderDate: string;
      franchise: string;
      status: string;
      valuation: number;
    }
  >();

  const uniqueFranchises = new Set<string>();

  dataRows.forEach((r) => {
    const orderNo = r[0];
    if (!orderNo) return;
    const franchise = r[2] || '—';
    if (franchise && franchise !== '—') {
      uniqueFranchises.add(franchise);
    }
    const lineTotal = parseNumber(r[8]);
    const status = (r[3] || 'PLACED').toUpperCase();

    if (!orderMap.has(orderNo)) {
      orderMap.set(orderNo, {
        orderNo,
        orderDate: r[1],
        franchise,
        status,
        valuation: lineTotal,
      });
    } else {
      const entry = orderMap.get(orderNo)!;
      entry.valuation += lineTotal;
    }
  });

  const totalOrders = orderMap.size;
  const totalValuation = Array.from(orderMap.values()).reduce(
    (sum, o) => sum + (o.status === 'CANCELLED' ? 0 : o.valuation),
    0
  );
  const totalQuantity = dataRows.reduce((sum, r) => sum + parseNumber(r[6]), 0);
  const activeFranchisesCount = uniqueFranchises.size;

  const filterSubtitleParts = [monthName];
  if (extraMeta?.franchiseName) {
    filterSubtitleParts.push(extraMeta.franchiseName);
  }
  if (params.orderStatus) {
    filterSubtitleParts.push(params.orderStatus);
  }

  const tableRowsHtml = dataRows.length
    ? dataRows
        .map((r) => {
          const orderNo = r[0] || '—';
          const orderDate = formatDate(r[1]);
          const franchise = r[2] || '—';
          const status = r[3] || 'PLACED';
          const product = r[5] || r[4] || '—';
          const quantity = formatQuantity(parseNumber(r[6]));
          const unitPrice = formatCurrency(parseNumber(r[7]));
          const lineTotal = formatCurrency(parseNumber(r[8]));

          const badgeClass =
            status === 'DELIVERED'
              ? 'badge-paid'
              : status === 'CANCELLED'
              ? 'badge-pending'
              : 'badge-info';

          return `<tr>
            <td class="text-center">${orderDate}</td>
            <td class="font-mono"><b>${orderNo}</b></td>
            <td><b>${franchise}</b></td>
            <td class="text-center"><span class="badge ${badgeClass}">${status}</span></td>
            <td>${product}</td>
            <td class="text-right">${quantity}</td>
            <td class="text-right">${unitPrice}</td>
            <td class="text-right"><b>${lineTotal}</b></td>
          </tr>`;
        })
        .join('')
    : '<tr><td colspan="8" class="text-center" style="padding:28px;color:#64748b;">No sales orders recorded for this billing cycle.</td></tr>';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Monthly Orders Report - ${monthName} - ${COMPANY_NAME}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <h1>${COMPANY_NAME}</h1>
  <h2>Monthly Orders Report · ${filterSubtitleParts.join(' · ')}</h2>
  <p>${COMPANY_LEGAL} · ${COMPANY_ADDRESS}<br>Franchise Distribution & Syrup Orders Statement</p>

  <div class="summary">
    <div class="box">Total Orders<br><b>${totalOrders}</b></div>
    <div class="box">Total Quantity<br><b>${formatQuantity(totalQuantity, 'Bottles')}</b></div>
    <div class="box">Total Order Valuation<br><b>${formatCurrency(totalValuation)}</b></div>
    <div class="box">Active Franchises<br><b>${activeFranchisesCount}</b></div>
  </div>

  <div class="toolbar">
    <button onclick="window.print()">Download PDF / Print</button>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center">Order Date</th>
        <th>Order Number</th>
        <th>Franchise Name</th>
        <th class="text-center">Status</th>
        <th>Flavour / Item</th>
        <th class="text-right">Quantity</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Line Total</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
    ${
      dataRows.length
        ? `<tfoot>
            <tr>
              <td colspan="5" class="text-right"><b>Total (Orders):</b></td>
              <td class="text-right"><b>${formatQuantity(totalQuantity)}</b></td>
              <td></td>
              <td class="text-right"><b>${formatCurrency(totalValuation)}</b></td>
            </tr>
          </tfoot>`
        : ''
    }
  </table>

  <div class="financial-summary-wrapper">
    <div class="financial-summary-card">
      <div class="financial-summary-header">Orders Valuation Summary</div>
      <div class="financial-summary-body">
        <div class="calc-row">
          <span>Total Orders Placed:</span>
          <b>${totalOrders}</b>
        </div>
        <div class="calc-row">
          <span>Total Bottles Ordered:</span>
          <b>${formatQuantity(totalQuantity, 'Bottles')}</b>
        </div>
        <div class="calc-row calc-total">
          <span>Total Order Valuation:</span>
          <b style="color:#0f766e; font-size:15px;">${formatCurrency(totalValuation)}</b>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return openPrintWindow(html);
}

/**
 * 3. Generate Monthly Invoices Report PDF View
 * Styled exactly like the franchise account ledger screenshot, with bottom corner calculation summary!
 */
export function generateInvoicesReportPdf(
  csvText: string,
  params: { month: string; franchiseId?: string; invoiceType?: string; paymentStatus?: string },
  extraMeta?: { franchiseName?: string; availableCredit?: number }
): boolean {
  const parsed = parseCsv(csvText);
  const dataRows = parsed.slice(1);
  const monthName = formatMonthName(params.month);

  // Group by distinct invoice number to prevent double counting summary totals
  const invoiceMap = new Map<
    string,
    {
      invoiceNumber: string;
      invoiceDate: string;
      franchiseName: string;
      invoiceType: string;
      dueDate: string;
      totalAmount: number;
      paidAmount: number;
      balanceAmount: number;
      paymentStatus: string;
      items: Array<{ flavour: string; qty: number; lineTotal: number }>;
    }
  >();

  dataRows.forEach((r) => {
    const invNo = r[0];
    if (!invNo) return;
    if (!invoiceMap.has(invNo)) {
      invoiceMap.set(invNo, {
        invoiceNumber: invNo,
        invoiceDate: r[1],
        franchiseName: r[2],
        invoiceType: r[3],
        dueDate: r[5],
        totalAmount: parseNumber(r[9]),
        paidAmount: parseNumber(r[10]),
        balanceAmount: parseNumber(r[11]),
        paymentStatus: r[12] || 'PENDING',
        items: [],
      });
    }
    const inv = invoiceMap.get(invNo)!;
    if (r[14]) {
      inv.items.push({
        flavour: r[14],
        qty: parseNumber(r[15]),
        lineTotal: parseNumber(r[17]),
      });
    }
  });

  const uniqueInvoices = Array.from(invoiceMap.values());
  const totalInvoiced = uniqueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = uniqueInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const pendingBalance = uniqueInvoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);

  const filterSubtitleParts = [monthName];
  if (extraMeta?.franchiseName) {
    filterSubtitleParts.push(extraMeta.franchiseName);
  }
  if (params.invoiceType) {
    filterSubtitleParts.push(`${params.invoiceType} Invoice`);
  }
  if (params.paymentStatus) {
    filterSubtitleParts.push(params.paymentStatus);
  }

  const tableRowsHtml = uniqueInvoices.length
    ? uniqueInvoices
        .map((inv) => {
          const invDate = formatDate(inv.invoiceDate);
          const dueDate = formatDate(inv.dueDate);
          const badgeClass =
            inv.paymentStatus === 'PAID'
              ? 'badge-paid'
              : inv.paymentStatus === 'PARTIALLY_PAID'
              ? 'badge-partial'
              : 'badge-pending';

          const itemsSummary = inv.items.length
            ? inv.items.map((i) => `${i.flavour} (${i.qty})`).join(', ')
            : inv.invoiceType ? `${inv.invoiceType} Bill` : 'Standard Bill';

          return `<tr>
            <td class="text-center">${invDate}</td>
            <td class="font-mono"><b>${inv.invoiceNumber}</b></td>
            <td><b>${inv.franchiseName || '—'}</b></td>
            <td><small>${itemsSummary}</small></td>
            <td class="text-center">${dueDate}</td>
            <td class="text-right"><b>${formatCurrency(inv.totalAmount)}</b></td>
            <td class="text-right" style="color:#047857">${formatCurrency(inv.paidAmount)}</td>
            <td class="text-right" style="color:${inv.balanceAmount > 0 ? '#b91c1c' : '#047857'}"><b>${formatCurrency(inv.balanceAmount)}</b></td>
            <td class="text-center"><span class="badge ${badgeClass}">${inv.paymentStatus}</span></td>
          </tr>`;
        })
        .join('')
    : '<tr><td colspan="9" class="text-center" style="padding:28px;color:#64748b;">No invoices recorded for this billing cycle.</td></tr>';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Monthly Invoices Report - ${monthName} - ${COMPANY_NAME}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <h1>${COMPANY_NAME}</h1>
  <h2>Monthly Invoices Report · ${filterSubtitleParts.join(' · ')}</h2>
  <p>${COMPANY_LEGAL} · ${COMPANY_ADDRESS}<br>Official Billing, GST & Accounts Receivable Statement</p>

  <div class="summary">
    <div class="box">Total Invoices<br><b>${uniqueInvoices.length}</b></div>
    <div class="box">Total Invoiced<br><b>${formatCurrency(totalInvoiced)}</b></div>
    <div class="box">Total Paid<br><b style="color:#047857;">${formatCurrency(totalPaid)}</b></div>
    <div class="box">Pending Balance<br><b style="color:${pendingBalance > 0 ? '#b91c1c' : '#047857'};">${formatCurrency(pendingBalance)}</b></div>
    ${
      extraMeta?.availableCredit !== undefined
        ? `<div class="box">Available Credit<br><b style="color:#0f766e;">${formatCurrency(extraMeta.availableCredit)}</b></div>`
        : ''
    }
  </div>

  <div class="toolbar">
    <button onclick="window.print()">Download PDF / Print</button>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center">Date</th>
        <th>Invoice Number</th>
        <th>Franchise Name</th>
        <th>Particulars / Items</th>
        <th class="text-center">Due Date</th>
        <th class="text-right">Total Amount</th>
        <th class="text-right">Paid Amount</th>
        <th class="text-right">Balance</th>
        <th class="text-center">Payment Status</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
    ${
      uniqueInvoices.length
        ? `<tfoot>
            <tr>
              <td colspan="5" class="text-right"><b>Total (All Invoices):</b></td>
              <td class="text-right"><b>${formatCurrency(totalInvoiced)}</b></td>
              <td class="text-right" style="color:#047857;"><b>${formatCurrency(totalPaid)}</b></td>
              <td class="text-right" style="color:${pendingBalance > 0 ? '#b91c1c' : '#047857'};"><b>${formatCurrency(pendingBalance)}</b></td>
              <td></td>
            </tr>
          </tfoot>`
        : ''
    }
  </table>

  <div class="financial-summary-wrapper">
    <div class="financial-summary-card">
      <div class="financial-summary-header">Invoices & Accounts Calculation</div>
      <div class="financial-summary-body">
        <div class="calc-row">
          <span>Total Invoiced Amount:</span>
          <b>${formatCurrency(totalInvoiced)}</b>
        </div>
        <div class="calc-row">
          <span>Total Amount Paid (Credit):</span>
          <b style="color:#047857;">${formatCurrency(totalPaid)}</b>
        </div>
        ${
          extraMeta?.availableCredit !== undefined
            ? `<div class="calc-row">
                <span>Available Credit Balance:</span>
                <b style="color:#0f766e;">${formatCurrency(extraMeta.availableCredit)}</b>
              </div>`
            : ''
        }
        <div class="calc-row calc-total">
          <span>Net Outstanding Balance:</span>
          <b style="color:${pendingBalance > 0 ? '#b91c1c' : '#047857'}; font-size:15px;">${formatCurrency(pendingBalance)}</b>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return openPrintWindow(html);
}

/**
 * 4. Generate Monthly Due Payments Report PDF View
 */
export function generateDuesReportPdf(
  csvText: string,
  params: { month: string; franchiseId?: string },
  extraMeta?: { franchiseName?: string }
): boolean {
  const parsed = parseCsv(csvText);
  const dataRows = parsed.slice(1);
  const monthName = formatMonthName(params.month);

  const totalInvoiced = dataRows.reduce((sum, r) => sum + parseNumber(r[4]), 0);
  const totalPaid = dataRows.reduce((sum, r) => sum + parseNumber(r[5]), 0);
  const totalOutstanding = dataRows.reduce((sum, r) => sum + parseNumber(r[6]), 0);
  const overdueRows = dataRows.filter((r) => (r[8] || '').toUpperCase() === 'OVERDUE');
  const overdueBalance = overdueRows.reduce((sum, r) => sum + parseNumber(r[6]), 0);

  const filterSubtitleParts = [monthName];
  if (extraMeta?.franchiseName) {
    filterSubtitleParts.push(extraMeta.franchiseName);
  }

  const tableRowsHtml = dataRows.length
    ? dataRows
        .map((r) => {
          const invNo = r[0] || '—';
          const franchise = r[1] || '—';
          const invDate = formatDate(r[2]);
          const dueDate = formatDate(r[3]);
          const totalAmount = formatCurrency(parseNumber(r[4]));
          const paidAmount = formatCurrency(parseNumber(r[5]));
          const balance = formatCurrency(parseNumber(r[6]));
          const dueType = (r[8] || 'UPCOMING').toUpperCase();
          const daysOverdue = parseNumber(r[9]);

          const dueTypeBadge =
            dueType === 'OVERDUE'
              ? 'badge-pending'
              : dueType === 'DUE_TODAY'
              ? 'badge-partial'
              : 'badge-info';

          return `<tr>
            <td class="font-mono"><b>${invNo}</b></td>
            <td><b>${franchise}</b></td>
            <td class="text-center">${invDate}</td>
            <td class="text-center"><b>${dueDate}</b></td>
            <td class="text-right">${totalAmount}</td>
            <td class="text-right" style="color:#047857">${paidAmount}</td>
            <td class="text-right" style="color:#b91c1c"><b>${balance}</b></td>
            <td class="text-center"><span class="badge ${dueTypeBadge}">${dueType.replace('_', ' ')}</span></td>
            <td class="text-center">${daysOverdue > 0 ? `<b style="color:#b91c1c">${daysOverdue} days</b>` : '—'}</td>
          </tr>`;
        })
        .join('')
    : '<tr><td colspan="9" class="text-center" style="padding:28px;color:#64748b;">No due or pending payments recorded for this billing cycle.</td></tr>';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Monthly Due Payments Report - ${monthName} - ${COMPANY_NAME}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <h1>${COMPANY_NAME}</h1>
  <h2>Monthly Due Payments Report · ${filterSubtitleParts.join(' · ')}</h2>
  <p>${COMPANY_LEGAL} · ${COMPANY_ADDRESS}<br>Credit Recovery, Overdue Commitments & Aging Statement</p>

  <div class="summary">
    <div class="box">Total Due Invoices<br><b>${dataRows.length}</b></div>
    <div class="box">Total Outstanding<br><b>${formatCurrency(totalOutstanding)}</b></div>
    <div class="box">Overdue Invoices<br><b>${overdueRows.length}</b></div>
    <div class="box">Overdue Balance<br><b>${formatCurrency(overdueBalance)}</b></div>
  </div>

  <div class="toolbar">
    <button onclick="window.print()">Download PDF / Print</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>Invoice Number</th>
        <th>Franchise Name</th>
        <th class="text-center">Invoice Date</th>
        <th class="text-center">Due Date</th>
        <th class="text-right">Total Amount</th>
        <th class="text-right">Paid Amount</th>
        <th class="text-right">Balance Due</th>
        <th class="text-center">Due Type</th>
        <th class="text-center">Aging / Overdue</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
    ${
      dataRows.length
        ? `<tfoot>
            <tr>
              <td colspan="4" class="text-right"><b>Total (Due Invoices):</b></td>
              <td class="text-right"><b>${formatCurrency(totalInvoiced)}</b></td>
              <td class="text-right" style="color:#047857;"><b>${formatCurrency(totalPaid)}</b></td>
              <td class="text-right" style="color:#b91c1c;"><b>${formatCurrency(totalOutstanding)}</b></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>`
        : ''
    }
  </table>

  <div class="financial-summary-wrapper">
    <div class="financial-summary-card">
      <div class="financial-summary-header">Dues & Recovery Calculation</div>
      <div class="financial-summary-body">
        <div class="calc-row">
          <span>Total Invoiced Dues:</span>
          <b>${formatCurrency(totalInvoiced)}</b>
        </div>
        <div class="calc-row">
          <span>Total Collected (Paid):</span>
          <b style="color:#047857;">${formatCurrency(totalPaid)}</b>
        </div>
        <div class="calc-row calc-total">
          <span>Net Outstanding Due Balance:</span>
          <b style="color:#b91c1c; font-size:15px;">${formatCurrency(totalOutstanding)}</b>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return openPrintWindow(html);
}
