import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import StarRating from '@/components/StarRating';

// ── SSG: generate all product pages at build time ──────────────
export async function generateStaticParams() {
  const products: Product[] = await fetch(
    'https://fakestoreapi.com/products'
  ).then((r) => r.json());

  return products.map((p) => ({ id: String(p.id) }));
}

// ── Dynamic SEO metadata per product ──────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image, alt: product.title }],
    },
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <div className="relative h-[420px] bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-10"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Details */}
        <div>
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 capitalize">
            {product.category}
          </span>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
            {product.title}
          </h1>

          <StarRating rating={product.rating.rate} count={product.rating.count} />

          <p className="text-4xl font-extrabold text-blue-600 mt-5 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <div className="border-t border-gray-100 pt-6 mb-8">
            <h2 className="font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-3">
            {/* Client component for cart interaction */}
            <AddToCartButton product={product} />
            <Link
              href="/products"
              className="block text-center text-gray-500 hover:text-blue-600 transition-colors py-2 text-sm"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Meta info */}
          <div className="mt-8 bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category</span>
              <p className="font-semibold capitalize mt-1">{product.category}</p>
            </div>
            <div>
              <span className="text-gray-500">Rating</span>
              <p className="font-semibold mt-1">
                {product.rating.rate}/5 ({product.rating.count} reviews)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
