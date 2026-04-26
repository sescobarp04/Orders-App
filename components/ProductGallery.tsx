'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Check, ShoppingBag, FileText } from 'lucide-react';
import { useOrder } from '../lib/OrderContext';
import { Product } from '../types/product';
import { cn } from '../lib/utils';
import Image from 'next/image';
import { jsPDF } from 'jspdf';

interface ProductGalleryProps {
    onClose: () => void;
}

export default function ProductGallery({ onClose }: ProductGalleryProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const { addToCart, priceList, cart, isAdmin } = useOrder();
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const password = isAdmin ? 'sescop_admin_2026' : '';
        fetch(`/api/products${password ? `?password=${password}` : ''}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    throw new Error('API did not return an array');
                }
            })
            .catch((err) => console.error('Error loading products from API:', err));
    }, [isAdmin]);

    const handleDownloadCatalog = async () => {
        setIsGenerating(true);
        const doc = new jsPDF();
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const date = new Date().toLocaleDateString('en-US');

        let y = 40;
        const itemsPerPage = 6; // 2 rows of 3
        const colWidth = (pageWidth - (margin * 2)) / 3;
        const rowHeight = 80;

        // Title Page / Header
        doc.setFontSize(24);
        doc.setTextColor(37, 99, 235);
        doc.setFont("helvetica", "bold");
        doc.text("PRODUCT CATALOG", margin, 25);

        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${date}`, pageWidth - margin - 30, 25);

        doc.setDrawColor(230, 230, 230);
        doc.line(margin, 30, pageWidth - margin, 30);

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const pageIndex = Math.floor(i / itemsPerPage);
            const itemInPage = i % itemsPerPage;
            const col = itemInPage % 3;
            const row = Math.floor(itemInPage / 3);

            if (itemInPage === 0 && i !== 0) {
                doc.addPage();
                y = 20;
            }

            const posX = margin + (col * colWidth);
            const posY = (itemInPage < 3 ? 40 : 40 + rowHeight); // Simple 2 row logic

            // Image
            if (product.image) {
                try {
                    const img = new (window as any).Image();
                    img.src = product.image;
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = resolve; // Continue anyway
                    });
                    doc.addImage(img, "JPEG", posX + 5, posY, colWidth - 10, 45);
                } catch (e) {
                    doc.rect(posX + 5, posY, colWidth - 10, 45);
                }
            } else {
                doc.rect(posX + 5, posY, colWidth - 10, 45);
            }

            // Text info
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            const nameLines = doc.splitTextToSize(product.name, colWidth - 10);
            doc.text(nameLines, posX + 5, posY + 50);

            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "normal");
            if (product.sku) {
                doc.text(`SKU: ${product.sku}`, posX + 5, posY + 62);
            }

            doc.setFontSize(10);
            doc.setTextColor(37, 99, 235);
            doc.setFont("helvetica", "bold");
            doc.text(`$${product.prices[priceList].toLocaleString('en-US')}`, posX + 5, posY + 68);

            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text(product.quantity_unit, posX + 5, posY + 72);
        }

        doc.save(`Catalog_Indiana_${new Date().getTime()}.pdf`);
        setIsGenerating(false);
    };

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

    return (
        <div className="fixed inset-0 bg-white dark:bg-black z-[60] flex flex-col h-full animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <header className="px-6 pt-10 pb-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-black z-10">
                <div className="flex-grow">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                        Catálogo de Productos
                    </h2>
                    <p className="text-sm text-zinc-500 font-medium">Visualiza todo nuestro inventario con imágenes</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadCatalog}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                        <FileText className="h-4 w-4" />
                        {isGenerating ? 'Generando...' : 'Descargar PDF'}
                    </button>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {/* Gallery Grid */}
            <div className="flex-grow overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="relative aspect-square bg-white dark:bg-zinc-800 flex items-center justify-center p-2">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 rounded-xl flex items-center justify-center p-4 text-center overflow-hidden">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-bold text-sm leading-tight line-clamp-4">
                                            {product.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 truncate">
                                    SKU: {product.sku}
                                </span>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 min-h-[40px]">
                                    {product.name}
                                </h3>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-blue-600 dark:text-blue-400 font-black text-lg">
                                            ${product.prices[priceList].toLocaleString('en-US')}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                                            {product.quantity_unit}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleAdd(product)}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                            addedIds.has(product.id)
                                                ? "bg-green-500 text-white"
                                                : "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-90"
                                        )}
                                    >
                                        {addedIds.has(product.id) ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <Plus className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black text-center">
                <button
                    onClick={onClose}
                    className="w-full max-w-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95"
                >
                    Volver a la Orden
                </button>
            </footer>
        </div>
    );
}
