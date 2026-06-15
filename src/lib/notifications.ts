import nodemailer from 'nodemailer';
import { Order } from '@/types';

// ─── Email Notification ───────────────────────────────────────
export async function sendOrderEmailToAdmin(order: Order): Promise<void> {
  // Guard: skip if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Notifications] SMTP not configured — skipping email.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT ?? '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.title}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.discountedPrice.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <div style="background:#2563eb;color:white;padding:24px;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:24px">🛒 New Order Received!</h1>
        <p style="margin:8px 0 0;opacity:0.85">Order ID: <strong>#${order.id}</strong></p>
      </div>
      <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0">

        <h2 style="color:#1e293b;margin-top:0">Customer Details</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:4px 0;color:#64748b;width:120px">Name</td>    <td><strong>${order.customerInfo.name}</strong></td></tr>
          <tr><td style="padding:4px 0;color:#64748b">Email</td>   <td>${order.customerInfo.email}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b">Phone</td>   <td>${order.customerInfo.phone}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b">Address</td> <td>${order.customerInfo.address}, ${order.customerInfo.city} — ${order.customerInfo.pincode}</td></tr>
        </table>

        <h2 style="color:#1e293b;margin-top:24px">Order Items</h2>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#e2e8f0">
              <th style="padding:8px;text-align:left">Product</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right;margin-top:16px">
          <p style="margin:4px 0;color:#64748b">Subtotal: $${order.subtotal.toFixed(2)}</p>
          ${order.discountAmount > 0 ? `<p style="margin:4px 0;color:#16a34a">Discount: -$${order.discountAmount.toFixed(2)}</p>` : ''}
          <p style="margin:4px 0;font-size:20px;font-weight:bold;color:#2563eb">Total: $${order.total.toFixed(2)}</p>
        </div>

        <div style="margin-top:16px;padding:12px;background:#dbeafe;border-radius:8px">
          <strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}
          ${order.paymentMethod === 'upi'  ? ` — UPI ID: ${(order.paymentDetails as { upiId: string }).upiId}` : ''}
          ${order.paymentMethod === 'card' ? ` — Card ending in ${(order.paymentDetails as { lastFourDigits: string }).lastFourDigits}` : ''}
        </div>

      </div>
      <div style="background:#1e293b;color:#94a3b8;padding:16px;border-radius:0 0 12px 12px;text-align:center;font-size:13px">
        NextStore Admin Notification — ${new Date().toLocaleString()}
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    `"NextStore" <${process.env.SMTP_USER}>`,
    to:      process.env.SMTP_USER,          // Send to admin's own email
    subject: `🛒 New Order #${order.id} — $${order.total.toFixed(2)} via ${order.paymentMethod.toUpperCase()}`,
    html,
  });

  console.log(`[Notifications] Email sent for order #${order.id}`);
}

// ─── SMS Notification (Twilio — optional) ────────────────────
export async function sendOrderSMSToAdmin(order: Order): Promise<void> {
  // Guard: skip if Twilio is not configured
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN  ||
    !process.env.TWILIO_PHONE_NUMBER ||
    !process.env.ADMIN_PHONE
  ) {
    console.warn('[Notifications] Twilio not configured — skipping SMS.');
    return;
  }

  // Dynamic import to avoid build errors if twilio is not installed
  const twilio = (await import('twilio')).default;
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const message =
    `📦 NEW ORDER #${order.id}\n` +
    `Customer: ${order.customerInfo.name}\n` +
    `Phone: ${order.customerInfo.phone}\n` +
    `Email: ${order.customerInfo.email}\n` +
    `Total: $${order.total.toFixed(2)}\n` +
    `Payment: ${order.paymentMethod.toUpperCase()}\n` +
    `Items: ${order.items.length}`;

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to:   process.env.ADMIN_PHONE,
  });

  console.log(`[Notifications] SMS sent for order #${order.id}`);
}
