
'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus } from 'lucide-react';
import type { ProductWithVariants, ProductVariant } from '@/types/product';

interface ProductDetailModalProps {
  product: ProductWithVariants;
  onClose: () => void;
  onAddToCart: (product: ProductWithVariants, variant: ProductVariant | null, quantity: number) => void;
  canAdd?: boolean;
}

export function ProductDetailModal({ product, onClose, onAddToCart, canAdd = true }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const basePrice = product.precio;
  const variantPrice = selectedVariant?.precio_adicional || 0;
  const totalPrice = (basePrice + variantPrice) * quantity;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="aspect-[4/3] relative overflow-hidden bg-muted">
            <img
              src={product.imagen_url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop'}
              alt={product.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop';
              }}
            />
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.nombre}</h2>
            {product.descripcion && (
              <p className="text-muted-foreground">{product.descripcion}</p>
            )}
          </div>

          {product.tiene_variantes && product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Selecciona una opción:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                    className={selectedVariant?.id === variant.id ? 'bg-[#8B4513] hover:bg-[#6B3410]' : ''}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.nombre}
                    {variant.precio_adicional > 0 && (
                      <span className="ml-2 text-xs">+S/ {variant.precio_adicional.toFixed(2)}</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Cantidad:</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Precio total:</p>
              <p className="text-3xl font-bold text-[#8B4513]">
                S/ {totalPrice.toFixed(2)}
              </p>
            </div>
            {canAdd && (
              <Button
                size="lg"
                className="bg-[#8B4513] hover:bg-[#6B3410] text-white"
                onClick={handleAdd}
              >
                Agregar al pedido
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
