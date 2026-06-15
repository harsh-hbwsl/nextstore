import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-extrabold text-blue-400 mb-3">
              NextStore
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for amazing products at unbeatable prices.
              Built with Next.js, TypeScript &amp; Tailwind CSS.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products?category=electronics', label: 'Electronics' },
                { href: '/products?category=jewelery', label: 'Jewelery' },
                { href: "/products?category=men's clothing", label: "Men's Clothing" },
                { href: "/products?category=women's clothing", label: "Women's Clothing" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Links */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Admin</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: '/admin', label: 'Dashboard' },
                { href: '/admin/add-product', label: 'Add Product' },
                { href: '/admin/products', label: 'My Products' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-600">
          © {year} NextStore. All rights reserved. Built for learning with Next.js 14.
        </div>
      </div>
    </footer>
  );
}
