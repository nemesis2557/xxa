
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import { upload } from '@zoerai/integration';
import type { EmployeeWithUser } from '@/types/employee';
import { ROLE_LABELS } from '@/constants/roles';

interface EmployeeFormModalProps {
  employee?: EmployeeWithUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmployeeFormModal({ employee, onClose, onSuccess }: EmployeeFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: employee?.nombre || '',
    apellido: employee?.apellido || '',
    sexo: employee?.sexo || '',
    dni: employee?.dni || '',
    celular: employee?.celular || '',
    email: employee?.email || '',
    password: '',
    role: employee ? (employee.role === process.env.NEXT_PUBLIC_SCHEMA_ADMIN_USER ? 'admin' : 'mesero') : 'mesero',
    avatar_url: employee?.avatar_url || '',
    estado: employee?.estado ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await upload.uploadWithPresignedUrl(file, {
        maxSize: 5 * 1024 * 1024,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      });

      if (result.success && result.url) {
        setFormData({ ...formData, avatar_url: result.url });
        toast.success('Foto subida correctamente');
      } else {
        toast.error(result.error || 'Error al subir la foto');
      }
    } catch (error) {
      toast.error('Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellido || !formData.dni) {
      toast.error('Nombre, apellido y DNI son obligatorios');
      return;
    }

    if (formData.dni.length !== 8) {
      toast.error('El DNI debe tener 8 dígitos');
      return;
    }

    if (formData.celular && formData.celular.length !== 9) {
      toast.error('El celular debe tener 9 dígitos');
      return;
    }

    if (!employee && !formData.email) {
      toast.error('El email es obligatorio');
      return;
    }

    if (!employee && !formData.password) {
      toast.error('La contraseña es obligatoria');
      return;
    }

    setLoading(true);
    try {
      if (employee) {
        await api.put(`/employees?id=${employee.id}`, formData);
        toast.success('Cambio hecho');
      } else {
        await api.post('/employees', formData);
        toast.success('Empleado creado');
      }
      onSuccess();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{employee ? 'Editar Empleado' : 'Crear Empleado'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.sexo} onValueChange={(v) => setFormData({ ...formData, sexo: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  maxLength={8}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  maxLength={9}
                />
              </div>
              <div>
                <Label htmlFor="role">Rol *</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!employee && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email / Usuario *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <Label>Foto de perfil</Label>
              <div className="mt-2 flex items-center gap-4">
                {formData.avatar_url && (
                  <img
                    src={formData.avatar_url}
                    alt="Avatar"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Subiendo...' : 'Subir foto'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#8B4513] hover:bg-[#6B3410] text-white"
                disabled={loading || uploading}
              >
                {employee ? 'Guardar cambios' : 'Crear empleado'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
