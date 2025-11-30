
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Trash2, Plus, ShoppingCart } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserRole } from '@/lib/role-utils';
import type { ShoppingNoteWithCreator } from '@/types/shopping-note';

interface ShoppingNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingNotesPanel({ isOpen, onClose }: ShoppingNotesPanelProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ShoppingNoteWithCreator[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const userRole = user ? getUserRole(user.role) : 'mesero';
  const canAdd = ['chef', 'ayudante', 'admin'].includes(userRole);
  const canDelete = userRole === 'admin';

  const fetchNotes = async () => {
    try {
      const data = await api.get<ShoppingNoteWithCreator[]>('/shopping-notes');
      setNotes(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error al cargar notas: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('La nota no puede estar vacía');
      return;
    }

    setLoading(true);
    try {
      await api.post('/shopping-notes', { contenido: newNote });
      setNewNote('');
      await fetchNotes();
      toast.success('Nota agregada');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await api.delete(`/shopping-notes?id=${id}`);
      await fetchNotes();
      toast.success('Nota eliminada');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Notas de compra para mañana
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {canAdd && (
            <div className="flex gap-2">
              <Input
                placeholder="Escribe una nota..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNote();
                  }
                }}
                disabled={loading}
              />
              <Button onClick={handleAddNote} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {notes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay notas de compra
              </p>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="p-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{note.contenido}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Creada por: {note.creator_name} • {new Date(note.created_at || '').toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
