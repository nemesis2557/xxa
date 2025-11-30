
'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, ShoppingCart, Play } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import { ShoppingNotesPanel } from '@/components/shopping-notes/ShoppingNotesPanel';
import { EmployeeFormModal } from '@/components/employees/EmployeeFormModal';
import type { EmployeeWithUser } from '@/types/employee';
import { ROLE_LABELS } from '@/constants/roles';

export default function EmpleadosPage() {
  const [employees, setEmployees] = useState<EmployeeWithUser[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await api.get<EmployeeWithUser[]>('/employees');
      setEmployees(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error al cargar empleados: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const handleEditEmployee = (employee: EmployeeWithUser) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedEmployee(null);
    fetchEmployees();
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

  const getRoleFromDbRole = (dbRole: string): string => {
    if (dbRole === process.env.NEXT_PUBLIC_SCHEMA_ADMIN_USER) {
      return 'admin';
    }
    return 'mesero';
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
          <Button
            className="gap-2 bg-[#8B4513] hover:bg-[#6B3410] text-white"
            onClick={handleCreateEmployee}
          >
            <Plus className="h-4 w-4" />
            Crear empleado
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Gestión de Empleados</h1>
          
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-semibold">#</th>
                  <th className="p-3 text-left font-semibold">ID</th>
                  <th className="p-3 text-left font-semibold">Nombre Completo</th>
                  <th className="p-3 text-left font-semibold">Rol</th>
                  <th className="p-3 text-left font-semibold">DNI</th>
                  <th className="p-3 text-left font-semibold">Celular</th>
                  <th className="p-3 text-left font-semibold">Usuario</th>
                  <th className="p-3 text-left font-semibold">Estado</th>
                  <th className="p-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => {
                  const role = getRoleFromDbRole(employee.role);
                  return (
                    <tr key={employee.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-mono text-xs">{employee.id}</td>
                      <td className="p-3">{employee.nombre} {employee.apellido}</td>
                      <td className="p-3">
                        <Badge variant="outline">{ROLE_LABELS[role] || role}</Badge>
                      </td>
                      <td className="p-3">{employee.dni}</td>
                      <td className="p-3">{employee.celular || '-'}</td>
                      <td className="p-3">{employee.email}</td>
                      <td className="p-3">
                        <Badge variant={employee.estado ? 'default' : 'secondary'}>
                          {employee.estado ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-3">
            {employees.map((employee, index) => {
              const role = getRoleFromDbRole(employee.role);
              return (
                <Card key={employee.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">#{index + 1} - {employee.nombre} {employee.apellido}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                      <Badge variant={employee.estado ? 'default' : 'secondary'}>
                        {employee.estado ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Rol:</span>
                        <p className="font-medium">{ROLE_LABELS[role] || role}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">DNI:</span>
                        <p className="font-medium">{employee.dni}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Celular:</span>
                        <p className="font-medium">{employee.celular || '-'}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {employees.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No hay empleados registrados</p>
              </CardContent>
            </Card>
          )}
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

      {formOpen && (
        <EmployeeFormModal
          employee={selectedEmployee}
          onClose={() => {
            setFormOpen(false);
            setSelectedEmployee(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </MainLayout>
  );
}
