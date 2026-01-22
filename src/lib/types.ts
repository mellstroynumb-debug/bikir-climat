export type Region = 'PMR' | 'MD';

export type OrderItem = {
  productId: string;
  quantity: number;
};

export type Product = {
  id: string;
  title: string;
  description?: string; // Made optional
  price_pmr: number | null;
  old_price_pmr?: number | null; // For discounts
  price_md: number | null;
  old_price_md?: number | null; // For discounts
  images: string[];
  specs: Record<string, string | number>; // Changed to dynamic key-value
  category: 'cond' | 'service';
  stockStatus: boolean;
};

export type CartItem = Product & {
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[]; // array of product IDs and quantities
  totalPrice: number;
  currency: 'PMR' | 'MD';
  status: 'new' | 'done';
  createdAt: any; // for serverTimestamp
};
