import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Product } from '@/types';
import ProductsClient from '@/components/ProductsClient';
import LoadingSpinner from '@/components/LoadingSpinner';

export const metadata: Metadata = {
  title: 'All Products',
  description:
    'Browse our full catalog of electronics, fashion, jewellery, and more.',
};

// force-dynamic = SSR on every request (no caching)
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    cache: 'no-store', // SSR: fresh data every request
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">All Products</h1>
        <p className="text-gray-500">{products.length} items available</p>
      </div>

      {/*
        Suspense is required because ProductsClient uses useSearchParams(),
        which needs a Suspense boundary in Next.js 14+.
      */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProductsClient products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
