'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, OrderItem, Pricing } from '../types/product';

interface CustomerInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
}

// Contraseña maestra (debe coincidir con la del API)
const ADMIN_PASSWORD = 'sescop_admin_2026';

interface OrderContextType {
    cart: OrderItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    priceList: keyof Pricing;
    setPriceList: (list: keyof Pricing) => void;
    customerInfo: CustomerInfo;
    setCustomerInfo: (info: CustomerInfo) => void;
    totalAmount: number;
    isAdmin: boolean;
    adminLogin: (password: string) => boolean;
    adminLogout: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [priceList, setPriceListState] = useState<keyof Pricing>('restaurante');
    const [isAdmin, setIsAdmin] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    // Persistencia en LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error parsing cart from storage", e);
            }
        }

        const savedInfo = localStorage.getItem('customerInfo');
        if (savedInfo) {
            try {
                setCustomerInfo(JSON.parse(savedInfo));
            } catch (e) {
                console.error("Error parsing customer info", e);
            }
        }

        const savedAdmin = localStorage.getItem('isAdmin') === 'true';
        if (savedAdmin) {
            setIsAdmin(true);
            const savedPriceList = localStorage.getItem('priceList') as keyof Pricing;
            if (savedPriceList) setPriceListState(savedPriceList);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    }, [customerInfo]);

    useEffect(() => {
        localStorage.setItem('isAdmin', isAdmin.toString());
        if (!isAdmin) {
            setPriceListState('restaurante');
            localStorage.removeItem('priceList');
        }
    }, [isAdmin]);

    useEffect(() => {
        if (isAdmin) {
            localStorage.setItem('priceList', priceList);
        }
    }, [priceList, isAdmin]);

    const adminLogin = (password: string) => {
        if (password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const adminLogout = () => {
        setIsAdmin(false);
        setPriceListState('restaurante');
    };

    const setPriceList = (list: keyof Pricing) => {
        if (isAdmin || list === 'restaurante') {
            setPriceListState(list);
        }
    };

    const addToCart = (product: Product, quantity: number) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            const pricePerUnit = product.prices[priceList] || product.prices.restaurante;

            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * pricePerUnit }
                        : item
                );
            }
            return [...prev, { product, quantity, pricePerUnit, total: quantity * pricePerUnit }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity, total: quantity * item.pricePerUnit }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

    return (
        <OrderContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                priceList,
                setPriceList,
                customerInfo,
                setCustomerInfo,
                totalAmount,
                isAdmin,
                adminLogin,
                adminLogout,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}
