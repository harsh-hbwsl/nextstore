import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import StarRating from '@/components/StarRating';
import { getAdminProducts, mapAdminToProduct } from '@/utils/productsStore';
import { discountsStore } from '@/lib/store';
import { getDiscountedPrice } from '@/lib/utils';

// ── SSG: generate all product pages at build time ──────────────
export async function generateStaticParams() {
  const apiProducts: Product[] = await fetch(
    'https://fakestoreapi.com/products'
  ).then((r) => r.json());

  const adminProds = getAdminProducts().map(mapAdminToProduct);
  const allProducts = [...adminProds, ...apiProducts];

  return allProducts.map((p) => ({ id: String(p.id) }));
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
  if (id.startsWith('admin-')) {
    const adminProduct = getAdminProducts().find((p) => p.id === id);
    if (adminProduct) {
      return mapAdminToProduct(adminProduct);
    }
    return null;
  }

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

  // Fetch active discounts to display proper pricing info
  const discounts = discountsStore.filter((d) => d.isActive);
  const { discountedPrice, originalPrice, discount, savedPercent } = getDiscountedPrice(
    product.price,
    product.category,
    discounts
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-10">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200 truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <div className="relative h-[420px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
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
          <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 capitalize">
            {product.category}
          </span>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-snug">
            {product.title}
          </h1>

          <StarRating rating={product.rating.rate} count={product.rating.count} />

          <div className="flex items-baseline gap-3 mt-5 mb-6">
            <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
              ${discountedPrice.toFixed(2)}
            </span>
            {discount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {savedPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mb-8">
            <h2 className="font-semibold text-gray-800 dark:text-white mb-3">Description</h2>
            <p className="text-gray-655 dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-3">
            {/* Client component for cart interaction, passing custom product with discounted price */}
            <AddToCartButton product={{ ...product, price: discountedPrice }} />
            <Link
              href="/products"
              className="block text-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 text-sm"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Meta info */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm border border-transparent dark:border-gray-700">
            <div>
              <span className="text-gray-500 dark:text-gray-405">Category</span>
              <p className="font-semibold dark:text-white capitalize mt-1">{product.category}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-405">Rating</span>
              <p className="font-semibold dark:text-white mt-1">
                {product.rating.rate}/5 ({product.rating.count} reviews)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
