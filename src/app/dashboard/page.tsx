
'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Play, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import { ShoppingNotesPanel } from '@/components/shopping-notes/ShoppingNotesPanel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [range, setRange] = useState('day');
  const [data, setData] = useState<any>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const result = await api.get(`/dashboard?range=${range}`);
      setData(result);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error al cargar datos: ${error.message}`);
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

  const getRangeLabel = () => {
    switch (range) {
      case 'day': return 'Hoy';
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mes';
      default: return 'Hoy';
    }
  };

  return (
    <MainLayout showLeftPanel={false}>
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
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Día</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-6">Dashboard - {getRangeLabel()}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas {getRangeLabel()}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#8B4513]">
                  S/ {data?.totalVentas?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data?.ordersCount || 0} pedidos completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.ordersCount || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de pedidos pagados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio por Pedido</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  S/ {data?.ordersCount > 0 ? (data.totalVentas / data.ordersCount).toFixed(2) : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ticket promedio
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Día</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.salesByDay && data.salesByDay.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.salesByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#8B4513" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-12">
                    No hay datos de ventas
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.topProducts && data.topProducts.length > 0 ? (
                  <div className="space-y-3">
                    {data.topProducts.map((product: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{product.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.ventas} unidades vendidas
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-[#8B4513]">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12">
                    No hay datos de productos
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
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
