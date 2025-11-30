
export interface Employee {
  id: number;
  user_id: number;
  nombre: string;
  apellido: string;
  sexo?: string;
  dni: string;
  celular?: string;
  avatar_url?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeWithUser extends Employee {
  email: string;
  role: string;
}
