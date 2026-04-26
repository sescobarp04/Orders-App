'use client';

import React, { useState, useEffect } from 'react';
import { Search, Package, Plus, Check, X } from 'lucide-react';
import { useOrder } from '../lib/OrderContext';
import { Product } from '../types/product';
import { cn } from '../lib/utils';
import Image from 'next/image';

export default function ProductSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    // Cargar productos desde API segura
    const { addToCart, priceList, cart, isAdmin } = useOrder();
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

    useEffect(() => {
        const password = isAdmin ? 'sescop_admin_2026' : ''; // Password de admin para el fetch si está logueado
        fetch(`/api/products${password ? `?password=${password}` : ''}`)
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data)) throw new Error('Invalid data');
                setProducts(data);
                setFilteredProducts(data.slice(0, 20));
            })
            .catch((err) => console.error('Error loading products:', err));
    }, [isAdmin]);

    // Filtrado de productos
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products.slice(0, 20));
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = products.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                (p.sku && p.sku.toLowerCase().includes(term)) ||
                (p.provider && p.provider.toLowerCase().includes(term))
        );
        setFilteredProducts(filtered.slice(0, 50)); // Limitar a 50 resultados para rendimiento
    }, [searchTerm, products]);

    const handleAdd = (product: Product) => {
        addToCart(product, 1);
        setAddedIds((prev) => new Set(prev).add(product.id));
        setTimeout(() => {
            setAddedIds((prev) => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }, 2000);
    };

    const isInCart = (productId: string) => {
        return cart.some(item => item.product.id === productId);
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto p-4">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, SKU o marca..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group flex items-center gap-4 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all shadow-sm hover:shadow-md"
                        >
                            <div
                                onClick={() => product.image && setPreviewImage({ url: product.image, name: product.name })}
                                className="relative h-16 w-16 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center cursor-zoom-in active:scale-95 transition-transform"
                            >
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center p-1 text-center overflow-hidden">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-bold text-[8px] leading-tight line-clamp-3">
                                            {product.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow min-w-0">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                    {product.name}
                                </h3>
                                {product.sku && <p className="text-xs text-zinc-500 truncate">{product.sku}</p>}
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                                        ${product.prices[priceList].toLocaleString('en-US')}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                                        {product.quantity_unit}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleAdd(product)}
                                className={cn(
                                    "h-10 w-10 flex items-center justify-center rounded-full transition-all",
                                    addedIds.has(product.id)
                                        ? "bg-green-500 text-white scale-110"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-500 hover:text-white"
                                )}
                            >
                                {addedIds.has(product.id) ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <Plus className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <Package className="h-12 w-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
                        <p className="text-zinc-500">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative w-full max-w-lg aspect-square bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <Image
                            src={previewImage.url}
                            alt={previewImage.name}
                            fill
                            className="object-contain p-4"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-white font-bold text-center drop-shadow-md">
                                {previewImage.name}
                            </p>
                        </div>
                        <button
                            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
