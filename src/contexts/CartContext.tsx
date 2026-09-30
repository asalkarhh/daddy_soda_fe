import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CustomSoda, CupSize, IceLevel } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  addPresetProduct: (product: Product, size?: CupSize, ice?: IceLevel) => void;
  addCustomSoda: (customSoda: CustomSoda) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  promoCode: string;
  discount: number;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  cartBadgeBounced: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [cartBadgeBounced, setCartBadgeBounced] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('daddy_soda_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('daddy_soda_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const triggerCartBadge = () => {
    setCartBadgeBounced(true);
    setTimeout(() => setCartBadgeBounced(false), 800);
  };

  const addItem = (itemData: Omit<CartItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: CartItem = { ...itemData, id };
    setItems((prev) => [...prev, newItem]);
    triggerCartBadge();
  };

  const addPresetProduct = (product: Product, size: CupSize = 'regular', ice: IceLevel = 'regular') => {
    let price = product.price;
    if (size === 'large') price += 40;
    if (size === 'daddy-tub') price += 80;

    addItem({
      type: 'preset',
      presetProduct: product,
      selectedSize: size,
      selectedIce: ice,
      quantity: 1,
      unitPrice: price,
    });
  };

  const addCustomSoda = (customSoda: CustomSoda) => {
    addItem({
      type: 'custom',
      customSoda,
      selectedSize: customSoda.size,
      selectedIce: customSoda.ice,
      quantity: 1,
      unitPrice: customSoda.totalPrice,
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscount(0);
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DADDY50') {
      setPromoCode('DADDY50');
      setDiscount(50);
      return { success: true, message: '₹50 OFF applied! Welcome to Daddy Soda.' };
    }
    if (clean === 'FIZZ10') {
      setPromoCode('FIZZ10');
      const pctDiscount = Math.round(subtotal * 0.1);
      setDiscount(pctDiscount > 0 ? pctDiscount : 20);
      return { success: true, message: '10% OFF applied!' };
    }
    return { success: false, message: 'Invalid code. Try "DADDY50" for ₹50 off.' };
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscount(0);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryType === 'pickup' || subtotal === 0 || subtotal >= 399 ? 0 : 30;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addPresetProduct,
        addCustomSoda,
        removeItem,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        promoCode,
        discount,
        applyPromo,
        removePromo,
        deliveryType,
        setDeliveryType,
        itemCount,
        subtotal,
        deliveryFee,
        grandTotal,
        cartBadgeBounced,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
