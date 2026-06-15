'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Product, Discount } from '@/types';
import ProductCard from './ProductCard';

interface ProductsClientProps {
  products: Product[];
  categories: string[];
  discounts?: Discount[];
}

export default function ProductsClient({
  products,
  categories,
  discounts = [],
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  /*
    Read ?category= from URL on first render.
    This makes the category links on the home page work:
    e.g. /products?category=electronics
  */
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Filter products based on search query and selected category
  const filtered = products.filter((product) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      product.title.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q);

    const matchesCategory =
      !selectedCategory || product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
  };

  const hasActiveFilters = search || selectedCategory;

  return (
    <div>
      {/* ── Search Bar ─────────────────────────────── */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          size={18}
        />
        <input
          type="text"
          placeholder="Search products by name, description, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-12 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Category Filter Pills ──────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
          <SlidersHorizontal size={13} />
          Filter:
        </span>

        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600'
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(selectedCategory.toLowerCase() === cat.toLowerCase() ? '' : cat)
            }
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ml-2"
          >
            <X size={11} className="inline mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* ── Results Summary ────────────────────────── */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Showing{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span>{' '}
        of {products.length} products
        {selectedCategory && (
          <span>
            {' '}
            in{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium capitalize">
              &ldquo;{selectedCategory}&rdquo;
            </span>
          </span>
        )}
        {search && (
          <span>
            {' '}
            matching{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              &ldquo;{search}&rdquo;
            </span>
          </span>
        )}
      </p>

      {/* ── Empty State ────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            We couldn&apos;t find anything matching your search. Try different
            keywords or clear your filters.
          </p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ── Product Grid ───────────────────────────── */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} discounts={discounts} />
          ))}
        </div>
      )}
    </div>
  );
}
