export interface Product {
  id: string;
  name: string;
  category: 'handbags' | 'watches';
  priceINR: number;
  discountPriceINR?: number;
  image: string;
  hoverImage: string;
  description: string;
  details: string[];
  specifications: Record<string, string>;
  rating: number;
  stock: number;
  colors: string[];
  featured?: boolean;
  bestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    color: string;
  }[];
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  subtotal: number;
  discount: number;
  total: number;
  currency: 'INR' | 'USD' | 'EUR';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  trackingNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
}
