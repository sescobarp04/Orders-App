'use client';

import React from 'react';
import { useOrder } from '../lib/OrderContext';
import { X, Trash2, Minus, Plus, ShoppingBag, Send, FileText, MessageSquare, Check, Package } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CartSummaryProps {
    onClose: () => void;
}

export default function CartSummary({ onClose }: CartSummaryProps) {
    const { cart, removeFromCart, updateQuantity, totalAmount, clearCart, customerInfo } = useOrder();

    const handleShareWhatsApp = () => {
        const date = new Date().toLocaleDateString('en-US');
        let message = `*ORDEN DE COMPRA*\n`;
        message += `---------------------------\n`;
        message += `*Date:* ${date}\n`;
        if (customerInfo.name) message += `*Customer:* ${customerInfo.name}\n`;
        if (customerInfo.address) message += `*Address:* ${customerInfo.address}\n`;
        if (customerInfo.phone) message += `*Phone:* ${customerInfo.phone}\n`;
        if (customerInfo.email) message += `*Email:* ${customerInfo.email}\n`;
        message += `---------------------------\n\n`;

        cart.forEach((item) => {
            message += `• *${item.product.name}*\n`;
            message += `  Cant: ${item.quantity} x $${item.pricePerUnit.toLocaleString('en-US')} = *$${item.total.toLocaleString('en-US')}*\n\n`;
        });

        message += `---------------------------\n`;
        message += `*TOTAL: $${totalAmount.toLocaleString('en-US')}*\n`;
        message += `---------------------------`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    const handleShareSMS = () => {
        const date = new Date().toLocaleDateString('en-US');
        let message = `ORDER INFO:\n`;
        if (customerInfo.name) message += `Customer: ${customerInfo.name}\n`;
        message += `Total: $${totalAmount.toLocaleString('en-US')}\n`;
        message += `Items:\n`;

        cart.forEach((item) => {
            message += `- ${item.product.name} (x${item.quantity})\n`;
        });

        const encodedMessage = encodeURIComponent(message);
        // Using sms: protocol. Some devices might require different separators for multiple numbers, 
        // but for a single message open it's usually just ?body=
        window.location.href = `sms:?body=${encodedMessage}`;
    };

    const handleConfirmOrder = () => {
        const orderData = {
            id: `ORD-${new Date().getTime()}`,
            date: new Date().toISOString(),
            customer: customerInfo,
            items: cart.map(item => ({
                sku: item.product.sku,
                name: item.product.name,
                quantity: item.quantity,
                price: item.pricePerUnit,
                total: item.total
            })),
            totalAmount: totalAmount
        };

        const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PEDIDO_${customerInfo.name || 'SIN_NOMBRE'}_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString('en-US');
        const margin = 20;
        let y = 20;

        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235);
        doc.text("ORDEN DE COMPRA", margin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date: ${date}`, margin, y);
        y += 10;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        if (customerInfo.name) {
            doc.text(`Customer: ${customerInfo.name}`, margin, y);
            y += 7;
        }
        if (customerInfo.address) {
            doc.text(`Address: ${customerInfo.address}`, margin, y);
            y += 7;
        }
        if (customerInfo.phone) {
            doc.text(`Phone: ${customerInfo.phone}`, margin, y);
            y += 7;
        }
        if (customerInfo.email) {
            doc.text(`Email: ${customerInfo.email}`, margin, y);
            y += 7;
        }
        y += 5;

        // Table Header
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, y, 190, y);
        y += 7;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Producto", margin, y);
        doc.text("Cant", 145, y);
        doc.text("Precio", 165, y);
        doc.text("Total", 190, y, { align: "right" });
        y += 5;

        doc.line(margin, y, 190, y);
        y += 10;

        // Items
        doc.setFont("helvetica", "normal");
        cart.forEach((item) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            const productName = item.product.name.length > 80
                ? item.product.name.substring(0, 77) + "... "
                : item.product.name;

            doc.text(productName, margin, y);
            doc.text(item.quantity.toString(), 148, y);
            doc.text(`$${item.pricePerUnit.toLocaleString('en-US')}`, 160, y);
            doc.text(`$${item.total.toLocaleString('en-US')}`, 190, y, { align: "right" });
            y += 10;
        });

        // Total Section
        y += 10;
        doc.setDrawColor(37, 99, 235);
        doc.line(margin, y, 190, y);
        y += 10;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL", margin, y);
        doc.text(`$${totalAmount.toLocaleString('en-US')}`, 190, y, { align: "right" });

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Generado por Orders App - Indiana, USA", margin, 285);

        doc.save(`PEDIDO_${customerInfo.name || 'SIN_NOMBRE'}_${new Date().getTime()}.pdf`);
    };


    if (cart.length === 0) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col items-center justify-center p-6">
                <div className="bg-zinc-100 dark:bg-zinc-900 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Tu pedido está vacío</h2>
                <p className="text-zinc-500 mb-8 text-center">Agrega algunos productos para empezar a armar tu orden.</p>
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col h-full">
            {/* Header */}
            <header className="px-6 pt-10 pb-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                        Tu Pedido
                    </h2>
                    {customerInfo.name && (
                        <p className="text-sm text-zinc-500 font-medium">Customer: {customerInfo.name}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="h-10 w-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400"
                >
                    <X className="h-6 w-6" />
                </button>
            </header>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 flex flex-col gap-4">
                {cart.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-3 rounded-2xl"
                    >
                        <div className="h-14 w-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {/* Aquí podriamos poner la imagen si está disponible */}
                            <ShoppingBag className="h-6 w-6 text-zinc-400" />
                        </div>

                        <div className="flex-grow min-w-0">
                            <h3 className="text-sm font-bold truncate">{item.product.name}</h3>
                            <p className="text-xs text-zinc-500 font-medium text-blue-600 dark:text-blue-400">
                                ${item.pricePerUnit.toLocaleString('en-US')} c/u
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1">
                                <button
                                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                    className="h-6 w-6 flex items-center justify-center text-zinc-500 hover:text-blue-500"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="h-6 w-6 flex items-center justify-center text-zinc-500 hover:text-blue-500"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Total */}
            <footer className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Total</p>
                        <p className="text-3xl font-black text-zinc-900 dark:text-white">
                            ${totalAmount.toLocaleString('en-US')}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (confirm('¿Seguro que quieres borrar todo el pedido?')) clearCart();
                        }}
                        className="text-xs font-bold text-red-500 uppercase tracking-tight hover:underline"
                    >
                        Limpiar todo
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-green-500/20"
                    >
                        <Send className="h-4 w-4" />
                        WhatsApp
                    </button>
                    <button
                        onClick={handleShareSMS}
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <MessageSquare className="h-4 w-4" />
                        SMS
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-900 text-white p-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-zinc-800/20"
                    >
                        <FileText className="h-4 w-4" />
                        PDF
                    </button>
                </div>

                <button
                    onClick={handleConfirmOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <Check className="h-5 w-5" />
                    Finalizar y Confirmar Orden
                </button>
            </footer>
        </div>
    );
}
