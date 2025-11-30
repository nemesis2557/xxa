
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, validateRequestBody } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  const userId = context.payload?.sub;

  if (!userId) {
    return createErrorResponse({
      errorMessage: 'Usuario no autenticado',
      status: 401,
    });
  }

  if (!body.order_id || !body.metodo) {
    return createErrorResponse({
      errorMessage: 'order_id y metodo son obligatorios',
      status: 400,
    });
  }

  if (body.metodo === 'yape' && !body.foto_yape_url && (!body.numero_operacion || !body.nombre_cliente)) {
    return createErrorResponse({
      errorMessage: 'Para pago con Yape debe proporcionar foto o número de operación y nombre',
      status: 400,
    });
  }

  const adminToken = await generateAdminUserToken();
  const paymentsCrud = new CrudOperations('payments', adminToken);
  const ordersCrud = new CrudOperations('orders', adminToken);

  const order = await ordersCrud.findById(body.order_id);
  if (!order) {
    return createErrorResponse({
      errorMessage: 'Pedido no encontrado',
      status: 404,
    });
  }

  if (order.estado !== 'listo') {
    return createErrorResponse({
      errorMessage: 'Solo se pueden pagar pedidos en estado "listo"',
      status: 400,
    });
  }

  const paymentData = {
    user_id: parseInt(userId),
    order_id: body.order_id,
    metodo: body.metodo,
    numero_operacion: body.numero_operacion || null,
    nombre_cliente: body.nombre_cliente || null,
    foto_yape_url: body.foto_yape_url || null,
    processed_by: parseInt(userId),
  };

  const payment = await paymentsCrud.create(paymentData);

  await ordersCrud.update(body.order_id, { estado: 'pagado' });

  return createSuccessResponse(payment, 201);
}, true);
