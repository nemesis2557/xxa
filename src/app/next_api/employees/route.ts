
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const GET = requestMiddleware(async (request, context) => {
  const adminToken = await generateAdminUserToken();
  const employeesCrud = new CrudOperations('employees', adminToken);
  const usersCrud = new CrudOperations('users', adminToken);
  
  const employees = await employeesCrud.findMany({}, {
    limit: 100,
    orderBy: { column: 'created_at', direction: 'desc' }
  });

  const employeesWithUsers = await Promise.all(
    employees.map(async (employee: any) => {
      const user = await usersCrud.findById(employee.user_id);
      return {
        ...employee,
        username: user?.username || '',
        email: user?.email || '',
        role: user?.role || '',
      };
    })
  );

  return createSuccessResponse(employeesWithUsers);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);

  if (!body.nombre || !body.apellido || !body.dni) {
    return createErrorResponse({
      errorMessage: 'Nombre, apellido y DNI son obligatorios',
      status: 400,
    });
  }

  if (body.dni.length !== 8) {
    return createErrorResponse({
      errorMessage: 'El DNI debe tener 8 dígitos',
      status: 400,
    });
  }

  if (!body.username || !body.password) {
    return createErrorResponse({
      errorMessage: 'Usuario y contraseña son obligatorios',
      status: 400,
    });
  }

  const adminToken = await generateAdminUserToken();
  const employeesCrud = new CrudOperations('employees', adminToken);
  const usersCrud = new CrudOperations('users', adminToken);

  const existingEmployees = await employeesCrud.findMany({ dni: body.dni });
  if (existingEmployees && existingEmployees.length > 0) {
    return createErrorResponse({
      errorMessage: 'Error: ya existe un empleado con este DNI',
      status: 400,
    });
  }

  const existingUsers = await usersCrud.findMany({ username: body.username });
  if (existingUsers && existingUsers.length > 0) {
    return createErrorResponse({
      errorMessage: 'Error: el usuario ya existe',
      status: 400,
    });
  }

  const dbRole = body.role === 'admin' 
    ? process.env.SCHEMA_ADMIN_USER || 'app20251127214152nuwafyrxyn_v1_admin_user'
    : process.env.SCHEMA_USER || 'app20251127214152nuwafyrxyn_v1_user';

  const userData = {
    username: body.username,
    email: body.email || `${body.username}@luwak.local`,
    password: body.password,
    role: dbRole,
    role_type: body.role || 'mesero',
  };

  const user = await usersCrud.create(userData);

  const employeeData = {
    user_id: user.id,
    nombre: body.nombre,
    apellido: body.apellido,
    sexo: body.sexo || null,
    dni: body.dni,
    celular: body.celular || null,
    avatar_url: body.avatar_url || null,
    estado: body.estado !== undefined ? body.estado : true,
    role_type: body.role || 'mesero',
  };

  const employee = await employeesCrud.create(employeeData);

  return createSuccessResponse(employee, 201);
}, true);

export const PUT = requestMiddleware(async (request, context) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return createErrorResponse({
      errorMessage: 'ID es requerido',
      status: 400,
    });
  }

  const body = await validateRequestBody(request);

  const adminToken = await generateAdminUserToken();
  const employeesCrud = new CrudOperations('employees', adminToken);

  const existing = await employeesCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Empleado no encontrado',
      status: 404,
    });
  }

  const updateData: any = {};
  if (body.nombre) updateData.nombre = body.nombre;
  if (body.apellido) updateData.apellido = body.apellido;
  if (body.sexo) updateData.sexo = body.sexo;
  if (body.celular) updateData.celular = body.celular;
  if (body.avatar_url !== undefined) updateData.avatar_url = body.avatar_url;
  if (body.estado !== undefined) updateData.estado = body.estado;
  if (body.role) updateData.role_type = body.role;

  const data = await employeesCrud.update(id, updateData);

  return createSuccessResponse(data);
}, true);
