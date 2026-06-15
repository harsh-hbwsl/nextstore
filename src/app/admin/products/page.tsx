'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminProduct } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">My Products</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {products.length} product{products.length !== 1 ? 's' : ''} added
          </p>
        </div>
        <Link
          href="/admin/add-product"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No products yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start by adding your first product.
          </p>
          <Link
            href="/admin/add-product"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors inline-block font-semibold shadow-md"
          >
            Add First Product
          </Link>
        </div>
      ) : (
        /* Table */
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
              <tr className="text-left text-xs font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 object-contain rounded border border-gray-100 dark:border-gray-700 bg-white p-1"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                      <span className="font-semibold text-gray-800 dark:text-gray-200 max-w-[220px] truncate">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 capitalize">{product.category}</td>
                  <td className="px-6 py-4 font-extrabold text-blue-600 dark:text-blue-400">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
