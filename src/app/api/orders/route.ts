import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/store';
import { Order } from '@/types';
import {
  sendOrderEmailToAdmin,
  sendOrderSMSToAdmin,
} from '@/lib/notifications';

// GET /api/orders  (admin only — middleware protects /admin/*)
export async function GET() {
  // Sort newest first
  return NextResponse.json(
    [...ordersStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );
}

// POST /api/orders  (place a new order)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Minimal validation
    const { customerInfo, items, paymentMethod, paymentDetails } = body;
    if (!customerInfo || !items?.length || !paymentMethod) {
      return NextResponse.json(
        { error: 'customerInfo, items, and paymentMethod are required.' },
        { status: 400 }
      );
    }

    const subtotal: number = items.reduce(
      (sum: number, item: { discountedPrice: number; quantity: number }) =>
        sum + item.discountedPrice * item.quantity,
      0
    );
    const originalTotal: number = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const discountAmount = parseFloat((originalTotal - subtotal).toFixed(2));
    const total = parseFloat(subtotal.toFixed(2));

    const newOrder: Order = {
      id:             `ORD-${Date.now()}`,
      userId:         body.userId,
      customerInfo,
      items,
      subtotal:       parseFloat(originalTotal.toFixed(2)),
      discountAmount,
      total,
      paymentMethod,
      paymentDetails,
      status:         'confirmed',
      createdAt:      new Date().toISOString(),
    };

    ordersStore.push(newOrder);

    // ── Notify admin (fire-and-forget, don't fail the order if email breaks) ──
    Promise.all([
      sendOrderEmailToAdmin(newOrder),
      sendOrderSMSToAdmin(newOrder),
    ]).catch((err) => console.error('[Notifications] Failed:', err));

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error('[Orders API]', err);
    return NextResponse.json(
      { error: 'Could not place order.' },
      { status: 500 }
    );
  }
}
