import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Product } from '@/types';
import ProductsClient from '@/components/ProductsClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getAdminProducts, mapAdminToProduct } from '@/utils/productsStore';
import { categoriesStore, discountsStore } from '@/lib/store';

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
  
  const apiProducts: Product[] = await res.json();
  const adminProds = getAdminProducts().map(mapAdminToProduct);
  
  return [...adminProds, ...apiProducts];
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  // Combine categories from store and products to ensure we don't miss any
  const storeCatSlugs = categoriesStore.map((c) => c.slug);
  const prodCategories = products.map((p) => p.category.toLowerCase());
  const categories = Array.from(new Set([...storeCatSlugs, ...prodCategories]));
  
  // Get active discounts directly from local store
  const discounts = discountsStore.filter((d) => d.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">All Products</h1>
        <p className="text-gray-500 dark:text-gray-400">{products.length} items available</p>
      </div>

      {/*
        Suspense is required because ProductsClient uses useSearchParams(),
        which needs a Suspense boundary in Next.js 14+.
      */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProductsClient products={products} categories={categories} discounts={discounts} />
      </Suspense>
    </div>
  );
}
