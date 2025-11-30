
export interface ShoppingNote {
  id: number;
  user_id: number;
  contenido: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
}

export interface ShoppingNoteWithCreator extends ShoppingNote {
  creator_name?: string;
}
