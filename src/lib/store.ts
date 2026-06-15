import bcrypt from 'bcryptjs';
import {
  User,
  Category,
  Discount,
  Order,
  AdminProduct,
} from '@/types';

// Extend the global object to keep the store across dev hot-reloads
const globalStore = global as unknown as {
  usersStore: User[];
  categoriesStore: Category[];
  discountsStore: Discount[];
  ordersStore: Order[];
  adminProductsStore: AdminProduct[];
};

export const usersStore: User[] = globalStore.usersStore || [
  {
    id: 'admin-1',
    name: 'Store Admin',
    email: process.env.ADMIN_EMAIL ?? 'admin@nextstore.com',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD ?? 'admin123', 10),
    role: 'admin',
    phone: process.env.ADMIN_PHONE ?? '',
    createdAt: new Date().toISOString(),
  },
];

export const categoriesStore: Category[] = globalStore.categoriesStore || [
  { id: 'cat-1', name: 'Electronics',      slug: 'electronics',      emoji: '💻', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Jewelery',          slug: 'jewelery',         emoji: '💍', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat-3', name: "Men's Clothing",    slug: "men's clothing",   emoji: '👔', isDefault: true, createdAt: new Date().toISOString() },
  { id: 'cat-4', name: "Women's Clothing",  slug: "women's clothing", emoji: '👗', isDefault: true, createdAt: new Date().toISOString() },
];

export const discountsStore: Discount[] = globalStore.discountsStore || [];

export const ordersStore: Order[] = globalStore.ordersStore || [];

// Reuse the global adminProducts if it exists from Phase 1, or start with empty
export const adminProductsStore: AdminProduct[] = globalStore.adminProductsStore || (global as any).adminProducts || [];

if (process.env.NODE_ENV !== 'production') {
  globalStore.usersStore = usersStore;
  globalStore.categoriesStore = categoriesStore;
  globalStore.discountsStore = discountsStore;
  globalStore.ordersStore = ordersStore;
  globalStore.adminProductsStore = adminProductsStore;
  // Also link back to productsStore just in case
  (global as any).adminProducts = adminProductsStore;
}
