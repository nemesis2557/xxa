
'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { OrderSummaryPanel } from '@/components/orders/OrderSummaryPanel';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ShoppingNotesPanel } from '@/components/shopping-notes/ShoppingNotesPanel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Play } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserRole, hasPermission } from '@/lib/role-utils';
import type { Category } from '@/types/product';
import type { ProductWithVariants } from '@/types/product';
import type { CartItem } from '@/types/order';

export default function InicioPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const userRole = user ? getUserRole(user.role) : 'mesero';
  const canCreateOrders = hasPermission(userRole, 'canCreateOrders');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await api.get<Category[]>('/categories');
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error al cargar categorías: ${error.message}`);
      }
    }
  };

  const fetchProducts = async (categoryId: number) => {
    try {
      const data = await api.get<ProductWithVariants[]>(`/products?category_id=${categoryId}`);
      setProducts(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error al cargar productos: ${error.message}`);
      }
    }
  };

  const handleAddToCart = (product: ProductWithVariants, variant: any, quantity: number) => {
    const basePrice = product.precio;
    const variantPrice = variant?.precio_adicional || 0;
    const precioUnitario = basePrice + variantPrice;
    const subtotal = precioUnitario * quantity;

    const newItem: CartItem = {
      product_id: product.id,
      product_name: product.nombre,
      variant_id: variant?.id,
      variant_name: variant?.nombre,
      cantidad: quantity,
      precio_unitario: precioUnitario,
      subtotal,
      imagen_url: product.imagen_url,
    };

    setCartItems([...cartItems, newItem]);
    toast.success('Producto agregado al pedido');
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('El pedido está vacío');
      return;
    }

    const confirmed = window.confirm('¿Está seguro de confirmar este pedido?');
    if (!confirmed) return;

    setLoading(true);
    try {
      await api.post('/orders', { items: cartItems });
      
      toast.success('Orden creada con éxito', {
        duration: 6000,
      });
      
      setCartItems([]);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    if (cartItems.length === 0) return;
    
    const confirmed = window.confirm('¿Está seguro de cancelar este pedido?');
    if (confirmed) {
      setCartItems([]);
      toast.info('Pedido cancelado');
    }
  };

  const handleStartShift = async () => {
    try {
      await api.post('/turnos');
      toast.success('Turno iniciado');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <MainLayout
      leftPanel={
        <OrderSummaryPanel
          items={cartItems}
          onRemoveItem={handleRemoveItem}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelOrder}
          loading={loading}
        />
      }
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleStartShift}
          >
            <Play className="h-4 w-4" />
            Comenzar turno
          </Button>
        </div>

        <div className="bg-muted/30 rounded-lg p-6">
          <Tabs value={selectedCategory?.toString()} onValueChange={(v) => setSelectedCategory(parseInt(v))}>
            <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id.toString()}
                  className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white"
                >
                  {category.nombre}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id.toString()} className="mt-6">
                <ProductGrid
                  products={products}
                  onAddToCart={handleAddToCart}
                  canAdd={canCreateOrders}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-[#8B4513] hover:bg-[#6B3410] text-white"
        onClick={() => setNotesOpen(true)}
      >
        <ShoppingCart className="h-6 w-6" />
      </Button>

      <ShoppingNotesPanel
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </MainLayout>
  );
}
