import { create } from 'zustand';
import type { Product, CartItem, Region } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface StoreState {
  region: Region;
  cart: CartItem[];
  setRegion: (region: Region) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

export const useStore = create<StoreState>((set, get) => ({
  region: 'PMR',
  cart: [],
  setRegion: (region) => set({ region }),
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set({ cart: updatedCart });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => {
    set(state => ({
      cart: state.cart.filter(item => item.id !== productId),
    }));
  },
  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
  getCartTotal: () => {
    const { cart, region } = get();
    return cart.reduce((total, item) => {
      const price = region === 'PMR' ? item.price_pmr : item.price_md;
      return total + (price || 0) * item.quantity;
    }, 0);
  },
}));
