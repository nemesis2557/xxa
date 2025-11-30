
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { search } = parseQueryParams(request);
  const searchParams = new URL(request.url).searchParams;
  const category_id = searchParams.get('category_id');
  
  const productsCrud = new CrudOperations('products', context.token);
  const variantsCrud = new CrudOperations('product_variants', context.token);
  
  const filters: any = { activo: true };
  if (category_id) {
    filters.category_id = parseInt(category_id);
  }

  const products = await productsCrud.findMany(filters, {
    limit: 100,
    orderBy: { column: 'nombre', direction: 'asc' }
  });

  const productsWithVariants = await Promise.all(
    products.map(async (product: any) => {
      if (product.tiene_variantes) {
        const variants = await variantsCrud.findMany({ product_id: product.id });
        return { ...product, variants };
      }
      return { ...product, variants: [] };
    })
  );

  return createSuccessResponse(productsWithVariants);
}, true);
