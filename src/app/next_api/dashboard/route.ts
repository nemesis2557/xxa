
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const GET = requestMiddleware(async (request, context) => {
  const { search } = parseQueryParams(request);
  const searchParams = new URL(request.url).searchParams;
  const range = searchParams.get('range') || 'day';

  const adminToken = await generateAdminUserToken();
  const ordersCrud = new CrudOperations('orders', adminToken);
  const orderItemsCrud = new CrudOperations('order_items', adminToken);
  const productsCrud = new CrudOperations('products', adminToken);

  const now = new Date();
  let startDate: Date;

  switch (range) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const allOrders = await ordersCrud.findMany({ estado: 'pagado' }, {
    limit: 1000,
    orderBy: { column: 'created_at', direction: 'desc' }
  });

  const filteredOrders = allOrders.filter((order: any) => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startDate;
  });

  const totalVentas = filteredOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
  const ordersCount = filteredOrders.length;

  const salesByDay: any[] = [];
  const productSales: Record<number, { nombre: string; ventas: number }> = {};

  for (const order of filteredOrders) {
    const orderDate = new Date(order.created_at);
    const dateKey = orderDate.toLocaleDateString('es-PE');
    
    const existingDay = salesByDay.find(d => d.date === dateKey);
    if (existingDay) {
      existingDay.total += parseFloat(order.total);
    } else {
      salesByDay.push({ date: dateKey, total: parseFloat(order.total) });
    }

    const items = await orderItemsCrud.findMany({ order_id: order.id });
    for (const item of items) {
      if (!productSales[item.product_id]) {
        const product = await productsCrud.findById(item.product_id);
        productSales[item.product_id] = {
          nombre: product?.nombre || 'Producto',
          ventas: 0,
        };
      }
      productSales[item.product_id].ventas += item.cantidad;
    }
  }

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.ventas - a.ventas)
    .slice(0, 5);

  return createSuccessResponse({
    totalVentas,
    ordersCount,
    salesByDay: salesByDay.slice(0, 7),
    topProducts,
  });
}, true);
