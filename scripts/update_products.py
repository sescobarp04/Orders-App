import pandas as pd
import json
import os

# Rutas relativas al script
excel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'lista_precios.xlsx'))
json_output = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'products.json'))

def process_prices():
    if not os.path.exists(excel_path):
        print(f"Error: Excel file not found at {excel_path}")
        return

    try:
        # Load the excel file
        df = pd.read_excel(excel_path)
        
        # Clean headers (strip whitespace)
        df.columns = [str(c).strip() for c in df.columns]
        
        # Drop rows with NaN ONLY in PRODUCTO (allow missing SKU)
        if 'PRODUCTO' in df.columns:
            df = df.dropna(subset=['PRODUCTO'])
        else:
            print("Error: Column 'PRODUCTO' not found in Excel.")
            return
        
        products = []
        for idx, row in df.iterrows():
            # Handle SKU and ID
            raw_sku = str(row.get('SKU', '')).strip() if not pd.isna(row.get('SKU')) else ""
            cleaned_sku = raw_sku if raw_sku != 'nan' else ""
            
            # Use SKU as ID, or a slug of the name + index if SKU is missing
            name = str(row.get('PRODUCTO', 'N/A')).strip()
            item_id = cleaned_sku if cleaned_sku else f"no-sku-{idx}-{name.lower().replace(' ', '-')[:15]}"

            # Extract prices and handle potential non-numeric values
            def clean_price(val):
                try:
                    if pd.isna(val): return 0
                    if isinstance(val, (int, float)): return float(val)
                    if isinstance(val, str):
                        val = val.replace('$', '').replace(',', '').strip()
                        if '+' in val or '%' in val: return 0
                    return float(val)
                except:
                    return 0

            product = {
                "id": item_id,
                "name": name,
                "sku": cleaned_sku,
                "provider": str(row.get('Proveedor', 'N/A')).strip() if not pd.isna(row.get('Proveedor')) else "N/A",
                "quantity_unit": str(row.get('CANTIDAD / UNIDADES', 'N/A')).strip() if not pd.isna(row.get('CANTIDAD / UNIDADES')) else "N/A",
                "prices": {
                    "cost": clean_price(row.get('Costo', 0)),
                    "don_roque": clean_price(row.get('Don Roque', 0)),
                    "retail": clean_price(row.get('Retail supermercado', 0)),
                    "restaurante": clean_price(row.get('Restaurante', 0))
                },
                "image": f"/images/products/{cleaned_sku}.jpg" if cleaned_sku else None
            }
            products.append(product)
        
        # Ensure data directory exists
        os.makedirs(os.path.dirname(json_output), exist_ok=True)
        
        # Save to JSON
        with open(json_output, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully processed {len(products)} products and saved to {json_output}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    process_prices()
