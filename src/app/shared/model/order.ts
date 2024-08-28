export interface Order {
  id?: number;
  totalProducts?: number;
  products: Product[];
  total: number;
  status: boolean;
}

export interface Product {
  description: string;
  price: number;
}
