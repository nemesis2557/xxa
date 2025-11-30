
import CrudOperations from './crud-operations';
import { generateAdminUserToken } from './auth';

export interface SeedUser {
  username: string;
  password: string;
  email: string;
  role_type: 'admin' | 'mesero' | 'cajero' | 'chef' | 'ayudante';
  nombre: string;
  apellido: string;
  dni: string;
}

export const SEED_USERS: SeedUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@luwak.test',
    role_type: 'admin',
    nombre: 'Administrador',
    apellido: 'LUWAK',
    dni: '10000001',
  },
  {
    username: 'mesero1',
    password: 'mesero123',
    email: 'mesero@luwak.test',
    role_type: 'mesero',
    nombre: 'Carlos',
    apellido: 'Montana',
    dni: '10000002',
  },
  {
    username: 'cajero1',
    password: 'cajero123',
    email: 'cajero@luwak.test',
    role_type: 'cajero',
    nombre: 'Ana',
    apellido: 'Torres',
    dni: '10000003',
  },
  {
    username: 'chef1',
    password: 'chef123',
    email: 'chef@luwak.test',
    role_type: 'chef',
    nombre: 'Juan',
    apellido: 'Ramirez',
    dni: '10000004',
  },
  {
    username: 'ayudante1',
    password: 'ayudante123',
    email: 'ayudante@luwak.test',
    role_type: 'ayudante',
    nombre: 'Luis',
    apellido: 'Gomez',
    dni: '10000005',
  },
];

export async function createSeedUsers() {
  try {
    const adminToken = await generateAdminUserToken();
    const usersCrud = new CrudOperations('users', adminToken);
    const employeesCrud = new CrudOperations('employees', adminToken);

    for (const seedUser of SEED_USERS) {
      const existingUsers = await usersCrud.findMany({ username: seedUser.username });
      
      if (existingUsers && existingUsers.length > 0) {
        console.log(`Usuario ${seedUser.username} ya existe, omitiendo...`);
        continue;
      }

      const dbRole = seedUser.role_type === 'admin' 
        ? process.env.SCHEMA_ADMIN_USER || 'app20251127214152nuwafyrxyn_v1_admin_user'
        : process.env.SCHEMA_USER || 'app20251127214152nuwafyrxyn_v1_user';

      const userData = {
        username: seedUser.username,
        email: seedUser.email,
        password: seedUser.password,
        role: dbRole,
        role_type: seedUser.role_type,
      };

      const user = await usersCrud.create(userData);
      console.log(`Usuario creado: ${seedUser.username} / ${seedUser.password}`);

      const employeeData = {
        user_id: user.id,
        nombre: seedUser.nombre,
        apellido: seedUser.apellido,
        dni: seedUser.dni,
        estado: true,
        role_type: seedUser.role_type,
      };

      await employeesCrud.create(employeeData);
      console.log(`Empleado creado para: ${seedUser.username}`);
    }

    console.log('Usuarios semilla creados exitosamente');
    console.log('='.repeat(60));
    console.log('USUARIOS DE PRUEBA:');
    console.log('='.repeat(60));
    SEED_USERS.forEach(user => {
      console.log(`${user.role_type.toUpperCase().padEnd(12)} | usuario: ${user.username.padEnd(12)} | contraseña: ${user.password}`);
    });
    console.log('='.repeat(60));
    
    return { success: true };
  } catch (error) {
    console.error('Error al crear usuarios semilla:', error);
    return { success: false, error };
  }
}
