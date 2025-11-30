
import CrudOperations from './crud-operations';
import { generateAdminUserToken } from './auth';

export interface SeedCategory {
  nombre: string;
  slug: string;
  orden: number;
  imagen_url?: string;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  { nombre: 'PREMIUM', slug: 'premium', orden: 1 },
  { nombre: 'CALIENTES', slug: 'calientes', orden: 2 },
  { nombre: 'HELADAS Y AL TIEMPO', slug: 'heladas-tiempo', orden: 3 },
  { nombre: 'ANDINOS', slug: 'andinos', orden: 4 },
  { nombre: 'TRADICIONAL', slug: 'tradicional', orden: 5 },
  { nombre: 'FAST FOOD', slug: 'fast-food', orden: 6 },
  { nombre: 'PARA ALMORZAR', slug: 'para-almorzar', orden: 7 },
  { nombre: 'SANDWICH', slug: 'sandwiches', orden: 8 },
  { nombre: 'PARA ACOMPAÑAR', slug: 'para-acompanar', orden: 9 },
  { nombre: 'CERVEZAS', slug: 'cervezas', orden: 10 },
  { nombre: 'COCTELES', slug: 'cocteles', orden: 11 },
  { nombre: 'VINOS', slug: 'vinos', orden: 12 },
  { nombre: 'GASEOSAS', slug: 'gaseosas', orden: 13 },
];

export async function createSeedCategories() {
  try {
    const adminToken = await generateAdminUserToken();
    const categoriesCrud = new CrudOperations('categories', adminToken);

    for (const category of SEED_CATEGORIES) {
      const existing = await categoriesCrud.findMany({ slug: category.slug });
      
      if (existing && existing.length > 0) {
        console.log(`Categoría ${category.nombre} ya existe, omitiendo...`);
        continue;
      }

      await categoriesCrud.create(category);
      console.log(`Categoría creada: ${category.nombre}`);
    }

    console.log('Categorías semilla creadas exitosamente');
    return { success: true };
  } catch (error) {
    console.error('Error al crear categorías semilla:', error);
    return { success: false, error };
  }
}
