import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };

const cards = [
  {
    href: '/admin/add-product',
    icon: '➕',
    color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400',
    title: 'Add Product',
    desc: 'Add a new product to the store inventory',
  },
  {
    href: '/admin/products',
    icon: '📦',
    color: 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400',
    title: 'My Products',
    desc: 'View and manage products you have added',
  },
  {
    href: '/admin/categories',
    icon: '🏷️',
    color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
    title: 'Categories',
    desc: 'Add, update, or remove product category labels',
  },
  {
    href: '/admin/discounts',
    icon: '💸',
    color: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400',
    title: 'Discount Rules',
    desc: 'Create category discounts and percentage values',
  },
  {
    href: '/admin/orders',
    icon: '🛒',
    color: 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400',
    title: 'Customer Orders',
    desc: 'Monitor details and audit checkout transactions',
  },
  {
    href: '/products',
    icon: '🛍',
    color: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400',
    title: 'View Store',
    desc: 'See the customer-facing storefront',
  },
];

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Welcome to the NextStore admin panel.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${card.color}`}
            >
              {card.icon}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6">
        <h2 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">ℹ️ About This Admin Panel</h2>
        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
          Product data, categories, discount rules, and orders are stored in memory and preserved across hot-reloads using global persistence.
          To keep data permanently, replace the in-memory array collections in{' '}
          <code className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">/src/lib/store.ts</code>{' '}
          with a database service.
        </p>
      </div>
    </div>
  );
}
