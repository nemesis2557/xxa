
import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { createSeedUsers } from '@/lib/seed-users';
import { createSeedCategories } from '@/lib/seed-categories';
import { createSeedProducts } from '@/lib/seed-products';

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando creación de datos semilla...');
    
    const usersResult = await createSeedUsers();
    if (!usersResult.success) {
      throw new Error('Error al crear usuarios semilla');
    }

    const categoriesResult = await createSeedCategories();
    if (!categoriesResult.success) {
      throw new Error('Error al crear categorías semilla');
    }

    const productsResult = await createSeedProducts();
    if (!productsResult.success) {
      throw new Error('Error al crear productos semilla');
    }

    return createSuccessResponse({
      message: 'Datos semilla creados exitosamente',
      users: usersResult,
      categories: categoriesResult,
      products: productsResult,
    });
  } catch (error) {
    console.error('Error en seed:', error);
    return createErrorResponse({
      errorMessage: error instanceof Error ? error.message : 'Error al crear datos semilla',
      status: 500,
    });
  }
}
