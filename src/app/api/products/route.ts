import { NextRequest, NextResponse } from 'next/server';

interface AdminProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: string;
}

/*
  In-memory store.
  ⚠️ This resets whenever the Next.js server restarts.
  For persistence, replace with a database (MongoDB, SQLite, Prisma, etc.)
  or write/read from a local JSON file using Node's `fs` module.
*/
const adminProducts: AdminProduct[] = [];

// GET /api/products → return all admin-added products
export async function GET() {
  return NextResponse.json(adminProducts);
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

    const newProduct: AdminProduct = {
      id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: body.title.trim(),
      description: body.description?.trim() || '',
      price: parseFloat(parseFloat(body.price).toFixed(2)),
      category: body.category?.trim() || 'uncategorized',
      image: body.image?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    adminProducts.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
