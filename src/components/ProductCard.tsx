'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product, Discount } from '@/types';
import StarRating from './StarRating';
import { getDiscountedPrice } from '@/lib/utils';

export default function ProductCard({
  product,
  discounts = [],
}: {
  product: Product;
  discounts?: Discount[];
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const { discountedPrice, originalPrice, discount, savedPercent } =
    getDiscountedPrice(product.price, product.category, discounts);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    // Pass the discounted price to the cart
    addToCart({
      ...product,
      price: discountedPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      {/* Image — links to detail page */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-48 bg-gray-50 dark:bg-gray-800/50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-10">
              <Tag size={10} />
              {savedPercent}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider capitalize mb-1">
          {product.category}
        </span>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </Link>
        <div className="my-2">
          <StarRating rating={product.rating.rate} count={product.rating.count} />
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            ${discountedPrice.toFixed(2)}
          </span>
          {discount && (
            <span className="text-xs text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
            added
              ? 'bg-green-500 text-white scale-95'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {added ? (
            <>
              <Check size={15} />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart size={15} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
