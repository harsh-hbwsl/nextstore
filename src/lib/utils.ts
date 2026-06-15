import { Discount } from '@/types';

export interface PriceResult {
  originalPrice: number;
  discountedPrice: number;
  discount: Discount | null;
  savedAmount: number;
  savedPercent: number;
}

/**
 * Returns the effective price for a product given active discounts.
 * Call this when rendering ProductCard or the checkout page.
 */
export function getDiscountedPrice(
  originalPrice: number,
  categorySlug: string,
  discounts: Discount[]
): PriceResult {
  const now = new Date();

  // Handle case where category slug could be slightly different
  const cleanSlug = categorySlug.toLowerCase().trim();

  const activeDiscount = discounts.find(
    (d) =>
      d.isActive &&
      d.categorySlug.toLowerCase().trim() === cleanSlug &&
      (!d.expiresAt || new Date(d.expiresAt) > now)
  );

  if (!activeDiscount) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discount: null,
      savedAmount: 0,
      savedPercent: 0,
    };
  }

  let discountedPrice: number;
  if (activeDiscount.type === 'percentage') {
    discountedPrice = originalPrice - (originalPrice * activeDiscount.value) / 100;
  } else {
    discountedPrice = Math.max(0, originalPrice - activeDiscount.value);
  }

  discountedPrice = parseFloat(discountedPrice.toFixed(2));
  const savedAmount = parseFloat((originalPrice - discountedPrice).toFixed(2));
  const savedPercent = originalPrice > 0 ? Math.round((savedAmount / originalPrice) * 100) : 0;

  return {
    originalPrice,
    discountedPrice,
    discount: activeDiscount,
    savedAmount,
    savedPercent,
  };
}
