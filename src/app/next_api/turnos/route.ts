
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const POST = requestMiddleware(async (request, context) => {
  const user_id = context.payload?.sub;
  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'Usuario no autenticado',
      status: 401,
    });
  }

  const turnosCrud = new CrudOperations('turnos', context.token);

  const activeTurno = await turnosCrud.findMany({ 
    user_id: parseInt(user_id),
  });

  const hasActiveTurno = activeTurno.some((t: any) => !t.fin);

  if (hasActiveTurno) {
    return createErrorResponse({
      errorMessage: 'Ya tiene un turno activo',
      status: 400,
    });
  }

  const newTurno = await turnosCrud.create({
    user_id: parseInt(user_id),
    inicio: new Date().toISOString(),
  });

  return createSuccessResponse(newTurno, 201);
}, true);

export const PUT = requestMiddleware(async (request, context) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return createErrorResponse({
      errorMessage: 'ID es requerido',
      status: 400,
    });
  }

  const turnosCrud = new CrudOperations('turnos', context.token);

  const existing = await turnosCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Turno no encontrado',
      status: 404,
    });
  }

  const updated = await turnosCrud.update(id, {
    fin: new Date().toISOString(),
  });

  return createSuccessResponse(updated);
}, true);
