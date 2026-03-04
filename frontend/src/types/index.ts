export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface Order {
  id: number;
  amount: number;
  created_at: string;
}

export interface OrderDetail extends Order {
  items: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  subtotal: number;
}
