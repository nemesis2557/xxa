
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, DollarSign } from 'lucide-react';
import type { OrderWithItems, OrderStatus } from '@/types/order';

interface OrdersTableProps {
  orders: OrderWithItems[];
  onEdit?: (order: OrderWithItems) => void;
  onDelete?: (orderId: number) => void;
  onPay?: (order: OrderWithItems) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canPay?: boolean;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; emoji: string }> = {
  pendiente: { label: 'Pendiente', color: 'bg-[#8B4513] text-white', emoji: '🟫' },
  cocinando: { label: 'Cocinando', color: 'bg-yellow-500 text-white', emoji: '🟨' },
  listo: { label: 'Listo', color: 'bg-red-500 text-white', emoji: '🟥' },
  pagado: { label: 'Pagado', color: 'bg-green-500 text-white', emoji: '🟩' },
};

export function OrdersTable({ orders, onEdit, onDelete, onPay, canEdit, canDelete, canPay }: OrdersTableProps) {
  return (
    <div className="space-y-4">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-semibold">#</th>
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Usuario</th>
              <th className="p-3 text-left font-semibold">Descripción</th>
              <th className="p-3 text-left font-semibold">Total</th>
              <th className="p-3 text-left font-semibold">Estado</th>
              <th className="p-3 text-left font-semibold">Fecha</th>
              <th className="p-3 text-left font-semibold">Hora</th>
              <th className="p-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = statusConfig[order.estado];
              const date = new Date(order.created_at || '');
              const canEditThis = canEdit && order.estado === 'pendiente';
              const canDeleteThis = canDelete && order.estado === 'pendiente';
              const canPayThis = canPay && order.estado === 'listo';

              return (
                <tr key={order.id} className="border-b hover:bg-muted/30">
                  <td className="p-3">{order.numero_pedido}</td>
                  <td className="p-3 font-mono text-xs">{order.id.toString().substring(0, 6)}</td>
                  <td className="p-3">{order.created_by_name}</td>
                  <td className="p-3 max-w-xs truncate">{order.descripcion_resumen}</td>
                  <td className="p-3 font-semibold">S/ {order.total.toFixed(2)}</td>
                  <td className="p-3">
                    <Badge className={status.color}>
                      {status.emoji} {status.label}
                    </Badge>
                  </td>
                  <td className="p-3">{date.toLocaleDateString('es-PE')}</td>
                  <td className="p-3">{date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {canEditThis && onEdit && (
                        <Button variant="outline" size="sm" onClick={() => onEdit(order)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDeleteThis && onDelete && (
                        <Button variant="outline" size="sm" onClick={() => onDelete(order.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {canPayThis && onPay && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => onPay(order)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Pagar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3">
        {orders.map((order) => {
          const status = statusConfig[order.estado];
          const date = new Date(order.created_at || '');
          const canEditThis = canEdit && order.estado === 'pendiente';
          const canDeleteThis = canDelete && order.estado === 'pendiente';
          const canPayThis = canPay && order.estado === 'listo';

          return (
            <Card key={order.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Pedido #{order.numero_pedido}</p>
                    <p className="text-sm text-muted-foreground">{order.created_by_name}</p>
                  </div>
                  <Badge className={status.color}>
                    {status.emoji} {status.label}
                  </Badge>
                </div>
                <p className="text-sm">{order.descripcion_resumen}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">S/ {order.total.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString('es-PE')} {date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {(canEditThis || canDeleteThis || canPayThis) && (
                  <div className="flex gap-2 pt-2 border-t">
                    {canEditThis && onEdit && (
                      <Button variant="outline" size="sm" onClick={() => onEdit(order)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}
                    {canDeleteThis && onDelete && (
                      <Button variant="outline" size="sm" onClick={() => onDelete(order.id)} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                        Eliminar
                      </Button>
                    )}
                    {canPayThis && onPay && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        onClick={() => onPay(order)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pagar
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No hay pedidos para mostrar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
