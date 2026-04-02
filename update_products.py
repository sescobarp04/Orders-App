import pandas as pd
import json
import os

def update_products():
    excel_path = 'lista_precios.xlsx'
    json_path = os.path.join('data', 'products.json')
    
    if not os.path.exists(excel_path):
        print(f"Error: {excel_path} not found.")
        return

    # Load Excel
    df = pd.read_excel(excel_path)
    
    # Clean column names (strip whitespace)
    df.columns = [c.strip() for c in df.columns]
    
    products = []
    
    for _, row in df.iterrows():
        sku = str(row['SKU']).strip()
        if not sku or sku == 'nan':
            continue
            
        product = {
            "id": sku,
            "name": str(row['PRODUCTO']).strip(),
            "sku": sku,
            "provider": str(row.get('Proveedor', 'Unknown')).strip(),
            "quantity_unit": str(row.get('CANTIDAD / UNIDADES', '')).strip(),
            "prices": {
                "cost": float(row.get('Costo', 0)),
                "don_roque": float(row.get('Don Roque', 0)),
                "retail": float(row.get('Retail supermercado', 0)),
                "restaurante": float(row.get('Restaurante', 0))
            },
            "image": f"/images/products/{sku}.jpg"
        }
        products.append(product)
        
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    # Save to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully updated {len(products)} products in {json_path}")

if __name__ == "__main__":
    update_products()
