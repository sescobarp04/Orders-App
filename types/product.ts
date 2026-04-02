export interface Pricing {
  cost: number;
  don_roque: number;
  retail: number;
  restaurante: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  provider: string;
  quantity_unit: string;
  prices: Pricing;
  image: string;
  category?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  pricePerUnit: number;
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  priceListUsed: keyof Pricing;
}
