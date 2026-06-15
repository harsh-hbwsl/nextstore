import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'NextStore — Your One-Stop Shop',
  description: 'Discover amazing products at unbeatable prices.',
};

async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products?limit=4', {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });
  if (!res.ok) throw new Error('Failed to fetch featured products');
  return res.json();
}

const CATEGORIES = [
  { name: 'electronics', emoji: '💻', label: 'Electronics' },
  { name: 'jewelery', emoji: '💍', label: 'Jewelery' },
  { name: "men's clothing", emoji: '👔', label: "Men's Clothing" },
  { name: "women's clothing", emoji: '👗', label: "Women's Clothing" },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-500/30 text-blue-100 text-sm font-medium px-4 py-1 rounded-full mb-6">
            🎉 Free shipping on orders over $50
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Shop the Best,
            <br />
            <span className="text-blue-200">Pay Less</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Thousands of products across electronics, fashion, jewellery, and more — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/products?category=electronics"
              className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
            >
              View Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Featured Products</h2>
          <p className="text-gray-500">Hand-picked just for you</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold inline-block"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Shop by Category</h2>
            <p className="text-gray-500">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ──────────────────────────────────────── */}
      <section className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '🔒', title: 'Secure Payment', desc: '100% protected' },
          ].map((b) => (
            <div key={b.title}>
              <div className="text-3xl mb-2">{b.icon}</div>
              <h3 className="font-bold mb-1">{b.title}</h3>
              <p className="text-blue-200 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
