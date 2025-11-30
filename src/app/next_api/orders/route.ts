
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const GET = requestMiddleware(async (request, context) => {
  const adminToken = await generateAdminUserToken();
  const ordersCrud = new CrudOperations('orders', adminToken);
  const orderItemsCrud = new CrudOperations('order_items', adminToken);
  const usersCrud = new CrudOperations('users', adminToken);
  const employeesCrud = new CrudOperations('employees', adminToken);
  
  const orders = await ordersCrud.findMany({}, {
    limit: 100,
    orderBy: { column: 'created_at', direction: 'desc' }
  });

  const ordersWithDetails = await Promise.all(
    orders.map(async (order: any) => {
      const items = await orderItemsCrud.findMany({ order_id: order.id });
      
      const user = await usersCrud.findById(order.user_id);
      const employees = await employeesCrud.findMany({ user_id: order.user_id });
      const employee = employees?.[0];
      
      const createdByName = employee 
        ? `${employee.nombre} ${employee.apellido}` 
        : user?.email || 'Usuario';

      return {
        ...order,
        items,
        created_by_name: createdByName,
      };
    })
  );

  return createSuccessResponse(ordersWithDetails);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  const userId = context.payload?.sub;

  if (!userId) {
    return createErrorResponse({
      errorMessage: 'Usuario no autenticado',
      status: 401,
    });
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return createErrorResponse({
      errorMessage: 'El pedido debe contener al menos un producto',
      status: 400,
    });
  }

  const total = body.items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0);
  
  const descripcionResumen = body.items
    .map((item: any) => item.product_name)
    .join(', ')
    .substring(0, 200);

  const adminToken = await generateAdminUserToken();
  const ordersCrud = new CrudOperations('orders', adminToken);
  const orderItemsCrud = new CrudOperations('order_items', adminToken);

  const orderData = {
    user_id: parseInt(userId),
    descripcion_resumen: descripcionResumen,
    total,
    estado: 'pendiente',
  };

  const order = await ordersCrud.create(orderData);

  for (const item of body.items) {
    const itemData = {
      user_id: parseInt(userId),
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.subtotal,
    };
    await orderItemsCrud.create(itemData);
  }

  return createSuccessResponse(order, 201);
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
  const ordersCrud = new CrudOperations('orders', adminToken);

  const existing = await ordersCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Pedido no encontrado',
      status: 404,
    });
  }

  const updateData: any = {};
  if (body.estado) updateData.estado = body.estado;

  const data = await ordersCrud.update(id, updateData);

  return createSuccessResponse(data);
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
  const ordersCrud = new CrudOperations('orders', adminToken);
  const orderItemsCrud = new CrudOperations('order_items', adminToken);

  const existing = await ordersCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Pedido no encontrado',
      status: 404,
    });
  }

  const items = await orderItemsCrud.findMany({ order_id: parseInt(id) });
  for (const item of items) {
    await orderItemsCrud.delete(item.id);
  }

  await ordersCrud.delete(id);

  return createSuccessResponse({ id });
}, true);
