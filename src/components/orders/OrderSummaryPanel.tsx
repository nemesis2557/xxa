
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import type { CartItem } from '@/types/order';

interface OrderSummaryPanelProps {
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function OrderSummaryPanel({ items, onRemoveItem, onConfirm, onCancel, loading }: OrderSummaryPanelProps) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const igv = subtotal * 0.18;
  const total = subtotal;

  return (
    <div className="space-y-4">
      <div className="relative h-48 rounded-lg overflow-hidden">
        <img
          src="/img-local/interior/local-1.webp"
          alt="Local LUWAK"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">LUWAK Cafetería</h2>
          <p className="text-sm">Resumen del pedido</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pedido Actual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay productos en el pedido
            </p>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product_name}</p>
                      {item.variant_name && (
                        <p className="text-xs text-muted-foreground">{item.variant_name}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {item.cantidad} x S/ {item.precio_unitario.toFixed(2)}
                        </span>
                        <span className="text-sm font-semibold">
                          S/ {item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Precios incluyen IGV (18%)
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar pedido
                </Button>
                <Button
                  className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white"
                  onClick={onConfirm}
                  disabled={loading}
                >
                  Confirmar pedido
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
