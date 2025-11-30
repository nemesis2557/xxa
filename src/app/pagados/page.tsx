
'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { ShoppingNotesPanel } from '@/components/shopping-notes/ShoppingNotesPanel';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Play, RefreshCw } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import type { OrderWithItems } from '@/types/order';

export default function PagadosPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get<OrderWithItems[]>('/orders?estado=pagado');
      setOrders(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error al cargar pedidos: ${error.message}`);
      }
    } finally {
      setLoading(false);
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
    <MainLayout showLeftPanel={false}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleStartShift}
            >
              <Play className="h-4 w-4" />
              Comenzar turno
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={fetchOrders}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Pedidos Pagados</h1>
          <OrdersTable orders={orders} />
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
