import { NextRequest, NextResponse } from 'next/server';
import { discountsStore } from '@/lib/store';
import { Discount } from '@/types';

// GET /api/discounts  (optionally ?active=true)
export async function GET(request: NextRequest) {
  const onlyActive = request.nextUrl.searchParams.get('active') === 'true';
  const now = new Date();

  const result = onlyActive
    ? discountsStore.filter(
        (d) =>
          d.isActive &&
          (!d.expiresAt || new Date(d.expiresAt) > now)
      )
    : discountsStore;

  return NextResponse.json(result);
}

// POST /api/discounts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.categorySlug || !body.type || body.value === undefined) {
      return NextResponse.json(
        { error: 'name, categorySlug, type, and value are required.' },
        { status: 400 }
      );
    }
    if (body.value <= 0) {
      return NextResponse.json(
        { error: 'Discount value must be greater than 0.' },
        { status: 400 }
      );
    }
    if (body.type === 'percentage' && body.value > 100) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100.' },
        { status: 400 }
      );
    }

    const newDiscount: Discount = {
      id:           `disc-${Date.now()}`,
      name:         body.name.trim(),
      type:         body.type,
      value:        parseFloat(body.value),
      categorySlug: body.categorySlug,
      isActive:     body.isActive ?? true,
      expiresAt:    body.expiresAt ?? undefined,
      createdAt:    new Date().toISOString(),
    };

    discountsStore.push(newDiscount);
    return NextResponse.json(newDiscount, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

// PATCH /api/discounts?id=disc-xxx  (toggle isActive or update fields)
export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const index = discountsStore.findIndex((d) => d.id === id);
  if (index === -1) return NextResponse.json({ error: 'Discount not found.' }, { status: 404 });

  const body = await request.json();
  discountsStore[index] = { ...discountsStore[index], ...body };
  return NextResponse.json(discountsStore[index]);
}

// DELETE /api/discounts?id=disc-xxx
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

  const index = discountsStore.findIndex((d) => d.id === id);
  if (index === -1) return NextResponse.json({ error: 'Discount not found.' }, { status: 404 });

  discountsStore.splice(index, 1);
  return NextResponse.json({ deleted: id });
}
