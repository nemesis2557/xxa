
export type PaymentMethod = 'efectivo' | 'yape';

export interface Payment {
  id: number;
  user_id: number;
  order_id: number;
  metodo: PaymentMethod;
  numero_operacion?: string;
  nombre_cliente?: string;
  foto_yape_url?: string;
  processed_by: number;
  processed_at?: string;
  created_at?: string;
  updated_at?: string;
}
