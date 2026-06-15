import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };

const cards = [
  {
    href: '/admin/add-product',
    icon: '➕',
    color: 'bg-blue-50 text-blue-600',
    title: 'Add Product',
    desc: 'Add a new product to the store inventory',
  },
  {
    href: '/admin/products',
    icon: '📦',
    color: 'bg-green-50 text-green-600',
    title: 'My Products',
    desc: 'View and manage products you have added',
  },
  {
    href: '/products',
    icon: '🛍',
    color: 'bg-purple-50 text-purple-600',
    title: 'View Store',
    desc: 'See the customer-facing storefront',
  },
];

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-10">Welcome to the NextStore admin panel.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${card.color}`}
            >
              {card.icon}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <h2 className="font-semibold text-blue-800 mb-2">ℹ️ About This Admin Panel</h2>
        <p className="text-blue-700 text-sm leading-relaxed">
          Products added via the admin form are stored in memory (resets on server restart).
          To persist data, replace the in-memory array in{' '}
          <code className="bg-blue-100 px-1 rounded">/api/products/route.ts</code>{' '}
          with a database like MongoDB, PostgreSQL, or a JSON file.
        </p>
      </div>
    </div>
  );
}
