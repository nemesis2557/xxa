
export interface User {
  sub: string;
  email: string;
  role: string;
  isAdmin: boolean;
  role_type?: 'admin' | 'mesero' | 'cajero' | 'chef' | 'ayudante';
}

export type UserRole = 'mesero' | 'cajero' | 'chef' | 'ayudante' | 'admin';

export interface UserWithEmployee extends User {
  employee_id?: number;
  nombre?: string;
  apellido?: string;
  avatar_url?: string;
  user_role?: UserRole;
}
