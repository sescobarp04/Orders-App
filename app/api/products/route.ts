import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Contraseña maestra (en un entorno real esto iría en variables de entorno)
const ADMIN_PASSWORD = 'sescop_admin_2026'; 

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    const isAdmin = password === ADMIN_PASSWORD;

    try {
        const filePath = path.join(process.cwd(), 'data', 'products.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        let products = JSON.parse(fileData);

        // Si no es admin, filtramos la lista de precios sensible
        if (!isAdmin) {
            products = products.map((product: any) => {
                const { prices, ...rest } = product;
                // Creamos un nuevo objeto de precios sin 'don_roque'
                const safePrices = { ...prices };
                delete safePrices.don_roque;
                
                return {
                    ...rest,
                    prices: safePrices
                };
            });
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error reading products data:', error);
        return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }
}

