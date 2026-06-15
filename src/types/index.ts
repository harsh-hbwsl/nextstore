// Product from FakeStore API
export interface Product {
  id: number | string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Product added via Admin panel
export interface AdminProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: string;
}

// Cart item
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── USER ────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;           // bcrypt hash — never plain text
  role: 'admin' | 'user';
  phone?: string;
  createdAt: string;
}

// ─── CATEGORY ────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;               // URL-safe lowercase, e.g. "men's clothing"
  description?: string;
  emoji?: string;
  isDefault: boolean;         // Default categories can't be deleted
  createdAt: string;
}

// ─── DISCOUNT ────────────────────────────────────────────────
export type DiscountDisplayName =
  | 'Flat Discount'
  | 'Special Offer'
  | 'Flash Sale'
  | 'Seasonal Discount'
  | 'Clearance Sale'
  | 'Weekend Deal'
  | 'Buy More Save More'
  | string;                   // Allow custom names too

export interface Discount {
  id: string;
  name: DiscountDisplayName;  // Human-readable name shown to customers
  type: 'percentage' | 'fixed';
  value: number;              // 20 → 20% off or $20 off
  categorySlug: string;       // Which category this applies to
  isActive: boolean;
  expiresAt?: string;         // ISO date — undefined means no expiry
  createdAt: string;
}

// ─── ORDER ───────────────────────────────────────────────────
export type PaymentMethod = 'cod' | 'card' | 'upi';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: number | string;
  title: string;
  price: number;              // Price at time of purchase (snapshot)
  discountedPrice: number;    // Price after discount
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

// Payment details — only safe data stored, never full card / CVV
export interface CODPaymentDetails   { type: 'cod' }
export interface CardPaymentDetails  {
  type: 'card';
  cardHolderName: string;
  lastFourDigits: string;    // Last 4 digits only — NEVER store full number
  expiryMonth: string;
  expiryYear: string;
}
export interface UPIPaymentDetails   { type: 'upi'; upiId: string }

export type PaymentDetails =
  | CODPaymentDetails
  | CardPaymentDetails
  | UPIPaymentDetails;

export interface Order {
  id: string;
  userId?: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  status: OrderStatus;
  createdAt: string;
}
