"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; product: Product; quantity: number }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QTY"; productId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

const STORAGE_KEY = "atelier-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "SET_QTY":
      return {
        items: state.items
          .map((i) =>
            i.product.id === action.productId
              ? { ...i, quantity: Math.max(1, action.quantity) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        dispatch({ type: "HYDRATE", items });
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD", product, quantity });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE", productId }),
    [],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "SET_QTY", productId, quantity }),
    [],
  );

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    );
    return {
      items: state.items,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [state.items, isOpen, openCart, closeCart, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
