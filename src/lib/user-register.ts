
import CrudOperations from '@/lib/crud-operations';
import { generateAdminUserToken } from '@/lib/auth';

export async function userRegisterCallback(user: {
  id: string;
  email: string;
  role: string;
}): Promise<void> {
  try {
    const adminToken = await generateAdminUserToken();
    const employeesCrud = new CrudOperations('employees', adminToken);

    const basicEmployee = {
      user_id: parseInt(user.id),
      nombre: user.email.split('@')[0],
      apellido: '',
      dni: '00000000',
      estado: true,
    };

    await employeesCrud.create(basicEmployee);
    console.log(`Created employee record for user ${user.id}`);
  } catch (error) {
    console.error('Failed to create employee record:', error);
  }
}
