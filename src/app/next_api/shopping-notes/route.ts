
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const GET = requestMiddleware(async (request, context) => {
  const adminToken = await generateAdminUserToken();
  const notesCrud = new CrudOperations('shopping_notes', adminToken);
  const employeesCrud = new CrudOperations('employees', adminToken);
  
  const notes = await notesCrud.findMany({}, {
    limit: 50,
    orderBy: { column: 'created_at', direction: 'desc' }
  });

  const notesWithCreator = await Promise.all(
    notes.map(async (note: any) => {
      const employee = await employeesCrud.findMany({ user_id: note.created_by });
      const creator = employee && employee.length > 0 ? employee[0] : null;
      
      return {
        ...note,
        creator_name: creator ? `${creator.nombre} ${creator.apellido}` : 'Desconocido',
      };
    })
  );

  return createSuccessResponse(notesWithCreator);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.contenido || body.contenido.trim() === '') {
    return createErrorResponse({
      errorMessage: 'El contenido de la nota es requerido',
      status: 400,
    });
  }

  const user_id = context.payload?.sub;
  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'Usuario no autenticado',
      status: 401,
    });
  }

  const adminToken = await generateAdminUserToken();
  const notesCrud = new CrudOperations('shopping_notes', adminToken);

  const newNote = await notesCrud.create({
    user_id: parseInt(user_id),
    contenido: body.contenido.trim(),
    created_by: parseInt(user_id),
  });

  return createSuccessResponse(newNote, 201);
}, true);

export const DELETE = requestMiddleware(async (request, context) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return createErrorResponse({
      errorMessage: 'ID es requerido',
      status: 400,
    });
  }

  const adminToken = await generateAdminUserToken();
  const notesCrud = new CrudOperations('shopping_notes', adminToken);

  const existing = await notesCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Nota no encontrada',
      status: 404,
    });
  }

  await notesCrud.delete(id);
  return createSuccessResponse({ id });
}, true);
