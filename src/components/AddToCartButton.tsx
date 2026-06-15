'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
        added
          ? 'bg-green-500 text-white scale-[0.98]'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
      }`}
    >
      {added ? (
        <>
          <Check size={22} />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart size={22} />
          Add to Cart
        </>
      )}
    </button>
  );
}
