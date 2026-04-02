'use client';

import React, { useState, useEffect } from 'react';
import ProductSearch from '@/components/ProductSearch';
import CartSummary from '@/components/CartSummary';
import ProductGallery from '@/components/ProductGallery';
import { useOrder } from '@/lib/OrderContext';
import { ShoppingCart, User, Settings, TrendingUp, Grid, X } from 'lucide-react';
import { Pricing } from '@/types/product';
import Image from 'next/image';

export default function Home() {
  const { customerInfo, setCustomerInfo, cart, totalAmount, isAdmin, adminLogin, adminLogout, priceList, setPriceList } = useOrder();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Auto-detección de Paraiso
  useEffect(() => {
    if (customerInfo.name.toLowerCase().includes('paraiso')) {
      if (isAdmin && priceList !== 'don_roque') {
        setPriceList('don_roque');
      }
    }
  }, [customerInfo.name, isAdmin, priceList, setPriceList]);

  const handleLogin = () => {
    if (adminLogin(passwordInput)) {
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    console.log("Logo clicked, detail:", e.detail);
    // 3 clicks o click derecho (context menu) para abrir
    if (e.detail >= 3) {
      alert("¡Gesto secreto detectado! Abriendo configuración...");
      console.log("Opening settings via 3-clicks");
      setIsSettingsOpen(true);
    }
  };

  const handleSettingsClick = () => {
    console.log("Settings icon clicked");
    alert("Icono de configuración presionado");
    setIsSettingsOpen(true);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black pb-32">
      {/* Header / Brand */}
      <header className="px-6 pt-10 pb-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div 
              className="h-10 w-24 relative flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              onContextMenu={(e) => {
                e.preventDefault();
                console.log("Context menu on logo");
                setIsSettingsOpen(true);
              }}
              onClick={handleLogoClick}
            >
              <Image
                src="/images/logo.png"
                alt="Company Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Antigravity Orders
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="h-10 px-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full font-bold text-sm transition-all active:scale-95"
            >
              <Grid className="h-4 w-4" />
              Ver Catálogo
            </button>
            <button 
              onClick={handleSettingsClick}
              className={`h-10 w-10 flex items-center justify-center rounded-full transition-colors ${isAdmin ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Admin Bar */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-bold text-amber-900 dark:text-amber-400 italic">
                Modo Admin Activo
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setPriceList('restaurante')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${priceList === 'restaurante' ? 'bg-amber-600 text-white shadow-md' : 'text-zinc-500'}`}
                >
                  Restaurante
                </button>
                <button 
                  onClick={() => setPriceList('don_roque')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${priceList === 'don_roque' ? 'bg-amber-600 text-white shadow-md' : 'text-zinc-500'}`}
                >
                  Don Roque
                </button>
            </div>
          </div>
        )}
        {/* Customer Information (English Labels) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Address"
              className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            />
          </div>

          <div className="relative col-span-1 md:col-span-2">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            />
          </div>
        </div>
      </header>

      {/* Main Content: Product Search */}
      <section className="max-w-2xl mx-auto">
        <ProductSearch />
      </section>

      {/* Floating Action Button (Cart) */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-20">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between transition-transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-blue-600">
                  {cart.length}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-100 font-medium">Ver pedido</p>
                <p className="text-sm font-bold">Resumen de compra</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black">${totalAmount.toLocaleString('en-US')}</p>
            </div>
          </button>
        </div>
      )}

      {/* Cart Overlay */}
      {isCartOpen && (
        <CartSummary onClose={() => setIsCartOpen(false)} />
      )}

      {/* Gallery Overlay */}
      {isGalleryOpen && (
        <ProductGallery onClose={() => setIsGalleryOpen(false)} />
      )}

      {/* Settings / Admin Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-black">Configuración</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="h-8 w-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-8">
              {!isAdmin ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-zinc-500 mb-4">Ingresa la contraseña maestra para habilitar opciones administrativas y listas de precios especiales.</p>
                    <input 
                      type="password" 
                      placeholder="Contraseña" 
                      className={`w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl outline-none focus:ring-2 transition-all ${loginError ? 'ring-red-500 border-red-500' : 'ring-blue-500/20'}`}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setLoginError(false);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    {loginError && <p className="text-xs text-red-500 mt-2 font-medium">Contraseña incorrecta</p>}
                  </div>
                  <button 
                    onClick={handleLogin}
                    className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-lg active:scale-95 transition-transform"
                  >
                    Acceder como Admin
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <p className="text-xs font-black uppercase text-amber-600 mb-4">Lista de precios activa</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setPriceList('restaurante')}
                        className={`p-4 rounded-xl text-sm font-bold transition-all border-2 ${priceList === 'restaurante' ? 'bg-amber-600 border-amber-600 text-white shadow-xl' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500'}`}
                      >
                        Restaurante
                      </button>
                      <button 
                        onClick={() => setPriceList('don_roque')}
                        className={`p-4 rounded-xl text-sm font-bold transition-all border-2 ${priceList === 'don_roque' ? 'bg-amber-600 border-amber-600 text-white shadow-xl' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500'}`}
                      >
                        Don Roque
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        adminLogout();
                        setIsSettingsOpen(false);
                      }}
                      className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      Cerrar Sesión Admin
                    </button>
                    <button 
                      onClick={() => setIsSettingsOpen(false)}
                      className="w-full py-4 text-zinc-500 font-bold text-sm"
                    >
                      Cerrar Configuración
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
