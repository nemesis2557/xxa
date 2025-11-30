
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const categoriesCrud = new CrudOperations('categories', context.token);
  
  const data = await categoriesCrud.findMany({}, {
    limit: 100,
    orderBy: { column: 'orden', direction: 'asc' }
  });

  return createSuccessResponse(data);
}, true);
