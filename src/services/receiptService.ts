// src/services/receiptService.ts
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { COMPANY } from '../constants/companyInfo';
import type { ProductWithId } from '../types/product';

export type ReceiptCustomer = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  email?: string;
};

// ─── Logo loader ──────────────────────────────────────────────────────────────

/**
 * Loads assets/images/logo.png and returns a base64 data-URL string.
 * Returns null if the file cannot be read (graceful fallback to text header).
 *
 * To use your own logo:
 *   Replace  assets/images/logo.png  with your image (PNG or JPG).
 *   The receipt will automatically pick it up on the next invoice.
 */
async function getLogoDataUrl(): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const asset = Asset.fromModule(require('../../assets/images/logo.png'));
    await asset.downloadAsync();

    if (Platform.OS === 'web') {
      const url = asset.uri || asset.localUri;
      if (!url) return null;
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }

    const localUri = asset.localUri;
    if (!localUri) return null;
    const base64 = await FileSystem.readAsStringAsync(localUri, {
encoding: 'base64',
    });
    const ext = (localUri.split('.').pop() ?? 'png').toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${base64}`;
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generates a short invoice number: INV-YYYYMMDD-XXXX */
export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `INV-${y}${m}${d}-${rand}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '0' : num.toLocaleString('en-PK');
}

/** Build a detailed product description string for the invoice line item. */
function buildProductDescription(product: ProductWithId): string {
  const lines: string[] = [`<strong>${product.name}</strong>`];
  // Identity
  if (product.brand) lines.push(`Brand: ${product.brand}`);
  if (product.modelNumber) lines.push(`Model No: ${product.modelNumber}`);
  // Classification
  if (product.category) lines.push(`Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}`);
  if (product.condition) {
    const condLabel = product.condition === 'new' ? 'New'
      : product.condition === 'used' ? 'Used'
      : product.condition;
    lines.push(`Condition: ${condLabel}`);
  }
  // Specs
  if (product.ramMemory) lines.push(`RAM / Storage: ${product.ramMemory}`);
  if (product.screenSize) lines.push(`Screen Size: ${product.screenSize}`);
  // Compliance
  if (product.ptaStatus)
    lines.push(`PTA Status: ${product.ptaStatus === 'approved' ? 'Approved' : 'Not Approved'}`);
  // Identifiers
  if (product.serialNumber) lines.push(`Serial No: ${product.serialNumber}`);
  if (product.sku) lines.push(`SKU: ${product.sku}`);
  if (product.barcode) lines.push(`Barcode: ${product.barcode}`);
  // Extra
  if (product.notes) lines.push(`Notes: ${product.notes}`);
  return lines.join('<br/>');
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

/** Builds a complete HTML receipt ready for printing / PDF conversion. */
export function buildReceiptHtml(
  customer: ReceiptCustomer,
  product: ProductWithId,
  invoiceNo: string,
  date: Date = new Date(),
  logoDataUrl: string | null = null
): string {
  const price =
    typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.price)) || 0;
  const qty = 1;
  const subtotal = price * qty;
  const tax = 0;
  const total = subtotal + tax;
  const description = buildProductDescription(product);

  const billToLines = [
    customer.name,
    customer.phone ?? '',
    customer.address ?? '',
    customer.city ?? '',
    customer.email ?? '',
  ]
    .filter(Boolean)
    .join('<br/>');

  // Logo HTML: show image if available, otherwise coloured company-name text
  const logoHtml = logoDataUrl
    ? `<img src="${logoDataUrl}" alt="${COMPANY.name}" style="max-height:72px;max-width:200px;object-fit:contain;display:block;margin-bottom:8px;" />`
    : `<div class="company-name">${COMPANY.name}</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Invoice ${invoiceNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      color: #1a1a2e;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 3px solid #2563eb;
      margin-bottom: 28px;
    }
    .company-name {
      font-size: 26px;
      font-weight: 800;
      color: #2563eb;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    .company-details {
      font-size: 12px;
      color: #475569;
      line-height: 1.75;
    }
    .invoice-label { text-align: right; }
    .invoice-title {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .invoice-meta {
      margin-top: 8px;
      font-size: 12px;
      color: #475569;
      line-height: 1.8;
      text-align: right;
    }
    .invoice-meta strong { color: #0f172a; }

    /* ── Billing boxes ── */
    .billing {
      display: flex;
      gap: 24px;
      margin-bottom: 28px;
    }
    .billing-box {
      flex: 0 0 48%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
    }
    .billing-box h3 {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .billing-box p {
      font-size: 13px;
      color: #0f172a;
      line-height: 1.8;
    }

    /* ── Items table ── */
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #2563eb; color: #fff; }
    thead th {
      padding: 11px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      text-align: left;
    }
    thead th.right { text-align: right; }
    tbody tr { border-bottom: 1px solid #e2e8f0; }
    tbody tr:last-child { border-bottom: none; }
    tbody td {
      padding: 14px;
      font-size: 13px;
      color: #1a1a2e;
      vertical-align: top;
      line-height: 1.75;
    }
    tbody td.right { text-align: right; }
    tbody td.center { text-align: center; }
    tbody tr:nth-child(even) { background: #f8fafc; }

    /* ── Totals ── */
    .totals { display: flex; justify-content: flex-end; margin-bottom: 32px; }
    .totals-table { width: 280px; }
    .totals-table tr td { padding: 6px 0; font-size: 13px; }
    .totals-table tr td:first-child { color: #64748b; font-weight: 500; }
    .totals-table tr td:last-child { text-align: right; font-weight: 600; color: #0f172a; }
    .total-row td {
      font-size: 16px !important;
      font-weight: 800 !important;
      color: #2563eb !important;
      border-top: 2px solid #e2e8f0;
      padding-top: 10px !important;
    }

    /* ── Footer ── */
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer-note { font-size: 11px; color: #64748b; line-height: 1.7; max-width: 360px; }
    .thank-you { font-size: 15px; font-weight: 700; color: #2563eb; text-align: right; }
  </style>
</head>
<body>

  <!-- Header: logo + company info (left) | INVOICE label (right) -->
  <div class="header">
    <div>
      ${logoHtml}
      <div class="company-details">
        ${COMPANY.addressLine1}<br/>
        ${COMPANY.addressLine2 ? COMPANY.addressLine2 + '<br/>' : ''}
        ${COMPANY.city}${COMPANY.province ? ', ' + COMPANY.province : ''}${COMPANY.country ? ', ' + COMPANY.country : ''}<br/>
        ${COMPANY.phone}<br/>
        ${COMPANY.email}${COMPANY.website ? ' | ' + COMPANY.website : ''}
        ${COMPANY.taxId ? '<br/>NTN: ' + COMPANY.taxId : ''}
      </div>
    </div>
    <div class="invoice-label">
      <div class="invoice-title">Invoice</div>
      <div class="invoice-meta">
        <strong>Date:</strong> ${formatDate(date)}<br/>
        <strong>Invoice No:</strong> ${invoiceNo}
      </div>
    </div>
  </div>

  <!-- Billing -->
  <div class="billing">
    <div class="billing-box">
      <h3>Bill To</h3>
      <p>${billToLines}</p>
    </div>
  </div>

  <!-- Items -->
  <table>
    <thead>
      <tr>
        <th style="width:8%">Qty</th>
        <th>Description</th>
        <th class="right" style="width:18%">Unit Price</th>
        <th class="right" style="width:18%">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">${qty}</td>
        <td>${description}</td>
        <td class="right">Rs. ${formatPrice(price)}</td>
        <td class="right">Rs. ${formatPrice(price * qty)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals">
    <table class="totals-table">
      <tr><td>Sub Total</td><td>Rs. ${formatPrice(subtotal)}</td></tr>
      <tr><td>Sales Tax</td><td>Rs. ${formatPrice(tax)}</td></tr>
      <tr><td>Shipping Charges</td><td>Rs. 0</td></tr>
      <tr class="total-row"><td>Total</td><td>Rs. ${formatPrice(total)}</td></tr>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-note">
      Make all cheques payable to: <strong>${COMPANY.name}</strong><br/>
      If you have any questions concerning this invoice, contact:<br/>
      ${COMPANY.name} &nbsp;·&nbsp; ${COMPANY.phone} &nbsp;·&nbsp; ${COMPANY.email}
    </div>
    <div class="thank-you">THANK YOU FOR YOUR BUSINESS!</div>
  </div>

</body>
</html>`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generates a PDF receipt and shares / prints it.
 * - iOS / Android: creates a real PDF file → native share sheet.
 * - Web: opens the browser print dialog (Save as PDF).
 *
 * Returns the invoice number for display / storage.
 */
export async function generateAndShareReceipt(
  customer: ReceiptCustomer,
  product: ProductWithId
): Promise<string> {
  const invoiceNo = generateInvoiceNumber();

  // Load logo (base64). Fails gracefully — receipt still generates without it.
  const logoDataUrl = await getLogoDataUrl();

  const html = buildReceiptHtml(customer, product, invoiceNo, new Date(), logoDataUrl);

  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 600);
    }
  } else {
    const { uri } = await Print.printToFileAsync({ html });
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Invoice ${invoiceNo}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      await Print.printAsync({ html });
    }
  }

  return invoiceNo;
}

// ─── Reprint from sale history ─────────────────────────────────────────────

/**
 * Reprints a receipt from stored sale data (Sales History screen).
 * Constructs minimal product/customer objects from what was saved in Firestore.
 */
export async function reprintSaleReceipt(params: {
  customerName: string;
  customerPhone?: string;
  productName: string;
  productId: string;
  price: number;
  invoiceNo?: string;
  saleDate?: Date;
}): Promise<string> {
  const invoiceNo = params.invoiceNo ?? generateInvoiceNumber();
  const logoDataUrl = await getLogoDataUrl();

  const customer: ReceiptCustomer = {
    id: '',
    name: params.customerName,
    phone: params.customerPhone,
  };

  const product: ProductWithId = {
    id: params.productId,
    name: params.productName,
    price: params.price,
    stock: 0,
  };

  const html = buildReceiptHtml(
    customer,
    product,
    invoiceNo,
    params.saleDate ?? new Date(),
    logoDataUrl
  );

  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => { printWindow.print(); }, 600);
    }
  } else {
    const { uri } = await Print.printToFileAsync({ html });
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Invoice ${invoiceNo}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      await Print.printAsync({ html });
    }
  }

  return invoiceNo;
}
