import { NextRequest, NextResponse } from 'next/server';
import { getAdminProducts, addAdminProduct } from '@/utils/productsStore';

// GET /api/products → return all admin-added products
export async function GET() {
  return NextResponse.json(getAdminProducts());
}

// POST /api/products → add a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    if (!body.price || isNaN(parseFloat(body.price)) || parseFloat(body.price) <= 0) {
      return NextResponse.json(
        { error: 'A valid price is required' },
        { status: 400 }
      );
    }

    const newProduct = addAdminProduct({
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      image: body.image,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
