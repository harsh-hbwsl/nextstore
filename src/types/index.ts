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
