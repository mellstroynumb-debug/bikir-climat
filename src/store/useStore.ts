import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Region } from '@/lib/types';

interface StoreState {
  region: Region;
  cart: CartItem[];
  favorites: Product[];
  compare: Product[];
  setRegion: (region: Region) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  getFavoritesCount: () => number;
  toggleCompare: (product: Product) => void;
  isCompared: (productId: string) => boolean;
  getCompareCount: () => number;
  removeFromCompare: (productId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
  region: 'PMR',
  cart: [],
  favorites: [],
  compare: [],
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
  increaseQuantity: (productId) => {
    set(state => ({
      cart: state.cart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },
  decreaseQuantity: (productId) => {
    set(state => ({
      cart: state.cart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      ),
    }));
  },
  clearCart: () => set({ cart: [] }),
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

  // Favorites
  isFavorite: (productId) => {
    const { favorites } = get();
    return favorites.some(p => p.id === productId);
  },
  toggleFavorite: (product) => {
    const { favorites } = get();
    const isFavorite = favorites.some(p => p.id === product.id);
    if (isFavorite) {
      set({ favorites: favorites.filter(p => p.id !== product.id) });
    } else {
      set({ favorites: [...favorites, product] });
    }
  },
  getFavoritesCount: () => get().favorites.length,

  // Compare
  isCompared: (productId) => {
    const { compare } = get();
    return compare.some(p => p.id === productId);
  },
  toggleCompare: (product) => {
    const { compare } = get();
    const isCompared = compare.some(p => p.id === product.id);
    if (isCompared) {
      set({ compare: compare.filter(p => p.id !== product.id) });
    } else {
      if (compare.length < 5) {
         set({ compare: [...compare, product] });
      }
    }
  },
  removeFromCompare: (productId) => {
     set(state => ({
      compare: state.compare.filter(item => item.id !== productId),
    }));
  },
  getCompareCount: () => get().compare.length,
    }),
    {
      name: 'bikir-climat-store',
      partialize: (state) => ({
        region: state.region,
        cart: state.cart,
        favorites: state.favorites,
        compare: state.compare,
      }),
    }
  )
);
