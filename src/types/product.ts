
export interface Category {
  id: number;
  nombre: string;
  slug: string;
  orden: number;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  category_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  activo: boolean;
  tiene_variantes: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  nombre: string;
  precio_adicional: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithVariants extends Product {
  variants?: ProductVariant[];
}
