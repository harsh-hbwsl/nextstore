import { NextRequest, NextResponse } from 'next/server';
import { categoriesStore } from '@/lib/store';
import { Category } from '@/types';

// GET /api/categories
export async function GET() {
  return NextResponse.json(categoriesStore);
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const slug = body.name.toLowerCase().trim();

    // Check for duplicate slug
    if (categoriesStore.find((c) => c.slug === slug)) {
      return NextResponse.json(
        { error: 'A category with this name already exists.' },
        { status: 409 }
      );
    }

    const newCategory: Category = {
      id:          `cat-${Date.now()}`,
      name:        body.name.trim(),
      slug,
      description: body.description?.trim() ?? '',
      emoji:       body.emoji?.trim() ?? '🏷️',
      isDefault:   false,
      createdAt:   new Date().toISOString(),
    };

    categoriesStore.push(newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

// DELETE /api/categories?id=cat-xxx
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 });
  }

  const index = categoriesStore.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
  }
  if (categoriesStore[index].isDefault) {
    return NextResponse.json(
      { error: 'Default categories cannot be deleted.' },
      { status: 403 }
    );
  }

  categoriesStore.splice(index, 1);
  return NextResponse.json({ deleted: id });
}
