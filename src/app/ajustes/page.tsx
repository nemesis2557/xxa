
'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Play, Upload } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import { ShoppingNotesPanel } from '@/components/shopping-notes/ShoppingNotesPanel';
import { getUserRole } from '@/lib/role-utils';
import { ROLE_LABELS } from '@/constants/roles';
import { upload } from '@zoerai/integration';

export default function AjustesPage() {
  const { user } = useAuth();
  const [notesOpen, setNotesOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userRole = user ? getUserRole(user.role) : 'mesero';
  const isAdmin = userRole === 'admin';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/user', {
        currentPassword,
        newPassword,
      });
      toast.success('Contraseña actualizada');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminPassword) {
      toast.error('La clave de administrador es obligatoria');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/admin-password', {
        adminPassword,
      });
      toast.success('Clave de administrador actualizada');
      setAdminPassword('');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await upload.uploadWithPresignedUrl(file, {
        maxSize: 5 * 1024 * 1024,
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      });

      if (result.success && result.url) {
        await api.put('/auth/user', {
          avatar_url: result.url,
        });
        toast.success('Foto de perfil actualizada');
      } else {
        toast.error(result.error || 'Error al subir la foto');
      }
    } catch (error) {
      toast.error('Error al subir la foto');
    } finally {
      setUploading(false);
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
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-6">Ajustes de Perfil</h1>

          <div className="grid gap-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nombre completo</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label>Email / Usuario</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Input value={ROLE_LABELS[userRole] || userRole} disabled />
                </div>
                <div>
                  <Label>Foto de perfil</Label>
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Subiendo...' : 'Cambiar foto'}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Contraseña actual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-white"
                    disabled={loading}
                  >
                    Cambiar contraseña
                  </Button>
                </form>
              </CardContent>
            </Card>

            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Clave de Administrador</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangeAdminPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="admin-password">Nueva clave de administrador</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Esta clave se usará para autorizaciones especiales
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-white"
                      disabled={loading}
                    >
                      Actualizar clave de administrador
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
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
