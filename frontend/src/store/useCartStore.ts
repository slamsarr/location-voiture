import { useState, useEffect } from 'react';
import { CartItem, Vehicle, BookingOption } from '../types';
import { calculateOneWayFee } from '../components/map/SenegalAgenciesMap';

const STORAGE_KEY = 'hertz_digital_cart_v1';

export function getStoredCart(): CartItem | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCartToStorage(cart: CartItem | null) {
  if (!cart) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
  window.dispatchEvent(new Event('cart_updated'));
}

export function useCart() {
  const [cart, setCart] = useState<CartItem | null>(getStoredCart());

  useEffect(() => {
    const handleUpdate = () => {
      setCart(getStoredCart());
    };
    window.addEventListener('cart_updated', handleUpdate);
    return () => window.removeEventListener('cart_updated', handleUpdate);
  }, []);

  const addToCart = (
    vehicle: Vehicle,
    startDate: string,
    endDate: string,
    options: BookingOption[] = [],
    pickupLocation: string = 'AIBD_DAKAR',
    returnLocation: string = 'AIBD_DAKAR',
    pickupTime: string = '10:00',
    returnTime: string = '10:00'
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const subtotal = vehicle.pricePerDay * durationDays;
    let optionsTotal = 0;
    options.forEach(opt => {
      optionsTotal += opt.pricePerDay * durationDays * (opt.quantity || 1);
    });

    const oneWayFee = calculateOneWayFee(pickupLocation, returnLocation);
    const taxTotal = 0;
    const totalAmount = subtotal + optionsTotal + oneWayFee + taxTotal;

    const newCartItem: CartItem = {
      vehicle,
      startDate,
      endDate,
      pickupTime,
      returnTime,
      pickupLocation,
      returnLocation,
      durationDays,
      options,
      dailyRate: vehicle.pricePerDay,
      subtotal,
      optionsTotal,
      oneWayFee,
      taxTotal,
      totalAmount,
      depositAmount: vehicle.deposit,
    };

    saveCartToStorage(newCartItem);
    setCart(newCartItem);
  };

  const updateOptions = (options: BookingOption[]) => {
    if (!cart) return;
    let optionsTotal = 0;
    options.forEach(opt => {
      optionsTotal += opt.pricePerDay * cart.durationDays * (opt.quantity || 1);
    });
    const oneWayFee = cart.oneWayFee || 0;
    const totalAmount = cart.subtotal + optionsTotal + oneWayFee + cart.taxTotal;

    const updated: CartItem = {
      ...cart,
      options,
      optionsTotal,
      totalAmount,
    };
    saveCartToStorage(updated);
    setCart(updated);
  };

  const clearCart = () => {
    saveCartToStorage(null);
    setCart(null);
  };

  return {
    cart,
    addToCart,
    updateOptions,
    clearCart,
    hasItems: !!cart,
  };
}
