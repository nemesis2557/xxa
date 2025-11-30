
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload } from 'lucide-react';
import type { OrderWithItems } from '@/types/order';
import { upload } from '@zoerai/integration';
import { toast } from 'sonner';

interface PaymentModalProps {
  order: OrderWithItems;
  onClose: () => void;
  onConfirm: (paymentData: any) => void;
  loading?: boolean;
}

export function PaymentModal({ order, onClose, onConfirm, loading }: PaymentModalProps) {
  const [metodo, setMetodo] = useState<'efectivo' | 'yape' | null>(null);
  const [numeroOperacion, setNumeroOperacion] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [fotoYapeUrl, setFotoYapeUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [usePhoto, setUsePhoto] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const result = await upload.uploadWithPresignedUrl(file, {
        maxSize: 5 * 1024 * 1024,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      });

      if (result.success && result.url) {
        setFotoYapeUrl(result.url);
        toast.success('Foto subida correctamente');
      } else {
        toast.error(result.error || 'Error al subir la foto');
      }
    } catch (error) {
      toast.error('Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleConfirm = () => {
    if (!metodo) {
      toast.error('Selecciona un método de pago');
      return;
    }

    if (metodo === 'yape') {
      if (usePhoto && !fotoYapeUrl) {
        toast.error('Sube una foto del comprobante de Yape');
        return;
      }
      if (!usePhoto && (!numeroOperacion || !nombreCliente)) {
        toast.error('Completa el número de operación y nombre del cliente');
        return;
      }
    }

    const paymentData: any = {
      order_id: order.id,
      metodo,
    };

    if (metodo === 'yape') {
      if (usePhoto) {
        paymentData.foto_yape_url = fotoYapeUrl;
      } else {
        paymentData.numero_operacion = numeroOperacion;
        paymentData.nombre_cliente = nombreCliente;
      }
    }

    onConfirm(paymentData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Procesar Pago</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Resumen del Pedido</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Pedido #:</span> {order.numero_pedido}</p>
                <p><span className="font-medium">Descripción:</span> {order.descripcion_resumen}</p>
                <p className="text-2xl font-bold text-[#8B4513]">
                  Total: S/ {order.total.toFixed(2)}
                </p>
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Estado actual: 🟥 Listo
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Método de Pago</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={metodo === 'efectivo' ? 'default' : 'outline'}
                  className={`h-20 ${metodo === 'efectivo' ? 'bg-[#8B4513] hover:bg-[#6B3410]' : ''}`}
                  onClick={() => setMetodo('efectivo')}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">💵</div>
                    <div className="text-sm">Efectivo</div>
                  </div>
                </Button>
                <Button
                  variant={metodo === 'yape' ? 'default' : 'outline'}
                  className={`h-20 ${metodo === 'yape' ? 'bg-[#8B4513] hover:bg-[#6B3410]' : ''}`}
                  onClick={() => setMetodo('yape')}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">📲</div>
                    <div className="text-sm">Yape</div>
                  </div>
                </Button>
              </div>

              {metodo === 'yape' && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant={usePhoto ? 'default' : 'outline'}
                      className={`flex-1 ${usePhoto ? 'bg-[#8B4513] hover:bg-[#6B3410]' : ''}`}
                      onClick={() => setUsePhoto(true)}
                    >
                      Subir foto
                    </Button>
                    <Button
                      variant={!usePhoto ? 'default' : 'outline'}
                      className={`flex-1 ${!usePhoto ? 'bg-[#8B4513] hover:bg-[#6B3410]' : ''}`}
                      onClick={() => setUsePhoto(false)}
                    >
                      Ingresar datos
                    </Button>
                  </div>

                  {usePhoto ? (
                    <div className="space-y-3">
                      <Label>Foto del comprobante de Yape</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        {fotoYapeUrl ? (
                          <div className="space-y-3">
                            <img
                              src={fotoYapeUrl}
                              alt="Comprobante Yape"
                              className="max-h-48 mx-auto rounded"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setFotoYapeUrl('')}
                            >
                              Cambiar foto
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                              disabled={uploadingPhoto}
                            />
                            <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {uploadingPhoto ? 'Subiendo...' : 'Click para subir foto'}
                            </p>
                          </label>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="numero-operacion">Número de operación</Label>
                        <Input
                          id="numero-operacion"
                          value={numeroOperacion}
                          onChange={(e) => setNumeroOperacion(e.target.value)}
                          placeholder="Ej: 123456789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre-cliente">Nombre y primer apellido</Label>
                        <Input
                          id="nombre-cliente"
                          value={nombreCliente}
                          onChange={(e) => setNombreCliente(e.target.value)}
                          placeholder="Ej: Juan Pérez"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
                onClick={handleConfirm}
                disabled={!metodo || loading || uploadingPhoto}
              >
                Confirmar pago
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
