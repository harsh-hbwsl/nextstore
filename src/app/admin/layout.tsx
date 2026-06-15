import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin | NextStore',
  },
};

const navLinks = [
  { href: '/admin', label: '🏠 Dashboard' },
  { href: '/admin/add-product', label: '➕ Add Product' },
  { href: '/admin/products', label: '📦 My Products' },
  { href: '/admin/categories', label: '🏷️ Categories' },
  { href: '/admin/discounts', label: '💸 Discount Rules' },
  { href: '/admin/orders', label: '🛒 Customer Orders' },
  { href: '/products', label: '🛍 View Store' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 dark:bg-black text-white flex flex-col transition-colors border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-blue-400">⚙️ Admin Panel</h2>
          <p className="text-gray-500 text-xs mt-1">NextStore Management</p>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-gray-600 text-xs text-center">NextStore v2.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-auto transition-colors">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
