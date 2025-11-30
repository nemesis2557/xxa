
'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { ProductWithVariants } from '@/types/product';
import { ProductDetailModal } from './ProductDetailModal';

interface ProductGridProps {
  products: ProductWithVariants[];
  onAddToCart: (product: ProductWithVariants, variant: any, quantity: number) => void;
  canAdd?: boolean;
}

export function ProductGrid({ products, onAddToCart, canAdd = true }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVariants | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
              <img
                src={product.imagen_url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=450&fit=crop'}
                alt={product.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=450&fit=crop';
                }}
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.nombre}</h3>
              <p className="text-2xl font-bold text-[#8B4513]">
                S/ {product.precio.toFixed(2)}
              </p>
              {canAdd && (
                <Button
                  className="w-full mt-3 bg-[#8B4513] hover:bg-[#6B3410] text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
          canAdd={canAdd}
        />
      )}
    </>
  );
}
