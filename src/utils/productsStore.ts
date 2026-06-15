import { AdminProduct, Product } from '@/types';

// Use global store to survive hot-reloading in dev mode
const globalForProducts = global as unknown as {
  adminProducts: AdminProduct[];
};

export const adminProducts: AdminProduct[] = globalForProducts.adminProducts || [];

if (process.env.NODE_ENV !== 'production') {
  globalForProducts.adminProducts = adminProducts;
}

export function getAdminProducts(): AdminProduct[] {
  return adminProducts;
}

export function addAdminProduct(product: {
  title: string;
  description: string;
  price: string | number;
  category: string;
  image?: string;
}): AdminProduct {
  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const newProduct: AdminProduct = {
    id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: product.title.trim(),
    description: product.description?.trim() || '',
    price: isNaN(priceNum) ? 0 : parseFloat(priceNum.toFixed(2)),
    category: product.category?.trim() || 'uncategorized',
    image: product.image?.trim() || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500',
    createdAt: new Date().toISOString(),
  };
  adminProducts.push(newProduct);
  return newProduct;
}

export function mapAdminToProduct(adminProduct: AdminProduct): Product {
  return {
    id: adminProduct.id,
    title: adminProduct.title,
    price: adminProduct.price,
    description: adminProduct.description,
    category: adminProduct.category,
    image: adminProduct.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500',
    rating: {
      rate: 4.5,
      count: 1,
    },
  };
}
