
export type OrderStatus = 'pendiente' | 'cocinando' | 'listo' | 'pagado';

export interface Order {
  id: number;
  user_id: number;
  numero_pedido: number;
  descripcion_resumen?: string;
  total: number;
  estado: OrderStatus;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  user_id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItemWithDetails extends OrderItem {
  product_name?: string;
  variant_name?: string;
}

export interface OrderWithItems extends Order {
  items?: OrderItemWithDetails[];
  created_by_name?: string;
}

export interface CartItem {
  product_id: number;
  product_name: string;
  variant_id?: number;
  variant_name?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen_url?: string;
}
