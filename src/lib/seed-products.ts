
import CrudOperations from './crud-operations';
import { generateAdminUserToken } from './auth';

export interface SeedProduct {
  category_slug: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  tiene_variantes: boolean;
  variants?: { nombre: string; precio_adicional: number }[];
}

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    category_slug: 'premium',
    nombre: 'Menú de 5 Tiempos',
    descripcion: 'Menú completo con entrada, sopa, plato de fondo, postre y bebida',
    precio: 70.00,
    imagen_url: '/img-carta/premium/menu-5-tiempos.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'premium',
    nombre: 'Buffet',
    descripcion: 'Buffet libre con variedad de platos',
    precio: 70.00,
    imagen_url: '/img-carta/premium/buffet.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'calientes',
    nombre: 'Espresso',
    descripcion: 'Café espresso tradicional',
    precio: 8.00,
    imagen_url: '/img-carta/calientes/espresso.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'calientes',
    nombre: 'Latte / Capuccino',
    descripcion: 'Café con leche espumosa',
    precio: 10.00,
    imagen_url: '/img-carta/calientes/latte.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'calientes',
    nombre: 'Emoliente',
    descripcion: 'Bebida caliente tradicional peruana',
    precio: 5.00,
    imagen_url: '/img-carta/calientes/emoliente.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'calientes',
    nombre: 'Emoliente con Licor',
    descripcion: 'Emoliente con tu licor favorito',
    precio: 12.00,
    imagen_url: '/img-carta/calientes/emoliente-licor.webp',
    tiene_variantes: true,
    variants: [
      { nombre: 'Pisco', precio_adicional: 0 },
      { nombre: 'Ron', precio_adicional: 0 },
      { nombre: 'Anís', precio_adicional: 0 },
      { nombre: 'Pulkay', precio_adicional: 0 },
    ],
  },
  {
    category_slug: 'heladas-tiempo',
    nombre: 'Milkshake',
    descripcion: 'Batido cremoso de tu sabor favorito',
    precio: 10.00,
    imagen_url: '/img-carta/heladas-tiempo/milkshake.webp',
    tiene_variantes: true,
    variants: [
      { nombre: 'Vainilla', precio_adicional: 0 },
      { nombre: 'Chocolate', precio_adicional: 0 },
      { nombre: 'Café', precio_adicional: 0 },
      { nombre: 'Lúcuma', precio_adicional: 0 },
      { nombre: 'Fresa', precio_adicional: 0 },
    ],
  },
  {
    category_slug: 'heladas-tiempo',
    nombre: 'Frapuccino',
    descripcion: 'Café helado batido',
    precio: 12.00,
    imagen_url: '/img-carta/heladas-tiempo/frapuccino.webp',
    tiene_variantes: true,
    variants: [
      { nombre: 'Vainilla', precio_adicional: 0 },
      { nombre: 'Chocolate', precio_adicional: 0 },
      { nombre: 'Café', precio_adicional: 0 },
      { nombre: 'Lúcuma', precio_adicional: 0 },
      { nombre: 'Fresa', precio_adicional: 0 },
    ],
  },
  {
    category_slug: 'heladas-tiempo',
    nombre: 'Jugos Naturales',
    descripcion: 'Jugos frescos de frutas',
    precio: 8.00,
    imagen_url: '/img-carta/heladas-tiempo/jugos.webp',
    tiene_variantes: true,
    variants: [
      { nombre: 'Fresa', precio_adicional: 0 },
      { nombre: 'Piña', precio_adicional: 0 },
      { nombre: 'Plátano', precio_adicional: 0 },
      { nombre: 'Papaya', precio_adicional: 0 },
    ],
  },
  {
    category_slug: 'andinos',
    nombre: 'Charqui',
    descripcion: 'Carne seca tradicional andina',
    precio: 25.00,
    imagen_url: '/img-carta/andinos/charqui.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'tradicional',
    nombre: 'Lomo Saltado',
    descripcion: 'Plato tradicional peruano con carne, papas y arroz',
    precio: 28.00,
    imagen_url: '/img-carta/tradicional/lomo-saltado.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'fast-food',
    nombre: 'Alitas',
    descripcion: 'Alitas de pollo crujientes',
    precio: 22.00,
    imagen_url: '/img-carta/fast-food/alitas.webp',
    tiene_variantes: true,
    variants: [
      { nombre: 'BBQ', precio_adicional: 0 },
      { nombre: 'Acevichada', precio_adicional: 0 },
      { nombre: 'Broster', precio_adicional: 0 },
      { nombre: 'Picantes', precio_adicional: 0 },
      { nombre: 'Mixto', precio_adicional: 2 },
    ],
  },
  {
    category_slug: 'fast-food',
    nombre: 'Hamburguesa',
    descripcion: 'Hamburguesa clásica con papas',
    precio: 18.00,
    imagen_url: '/img-carta/fast-food/hamburguesa.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'para-almorzar',
    nombre: 'Bisteck a lo Pobre',
    descripcion: 'Bisteck con huevo, plátano y papas',
    precio: 26.00,
    imagen_url: '/img-carta/para-almorzar/bisteck-pobre.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'sandwiches',
    nombre: 'Sándwich de Pollo',
    descripcion: 'Sándwich de filete de pollo',
    precio: 15.00,
    imagen_url: '/img-carta/sandwiches/sandwich-pollo.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'cervezas',
    nombre: 'Cerveza Nacional',
    descripcion: 'Cerveza peruana',
    precio: 8.00,
    imagen_url: '/img-carta/cervezas/cerveza.webp',
    tiene_variantes: false,
  },
  {
    category_slug: 'gaseosas',
    nombre: 'Gaseosa Personal',
    descripcion: 'Gaseosa 500ml',
    precio: 4.00,
    imagen_url: '/img-carta/gaseosas/gaseosa.webp',
    tiene_variantes: false,
  },
];

export async function createSeedProducts() {
  try {
    const adminToken = await generateAdminUserToken();
    const categoriesCrud = new CrudOperations('categories', adminToken);
    const productsCrud = new CrudOperations('products', adminToken);
    const variantsCrud = new CrudOperations('product_variants', adminToken);

    for (const product of SEED_PRODUCTS) {
      const categories = await categoriesCrud.findMany({ slug: product.category_slug });
      
      if (!categories || categories.length === 0) {
        console.log(`Categoría ${product.category_slug} no encontrada, omitiendo producto ${product.nombre}`);
        continue;
      }

      const category = categories[0];

      const existingProducts = await productsCrud.findMany({ 
        nombre: product.nombre,
        category_id: category.id 
      });
      
      if (existingProducts && existingProducts.length > 0) {
        console.log(`Producto ${product.nombre} ya existe, omitiendo...`);
        continue;
      }

      const productData = {
        category_id: category.id,
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio,
        imagen_url: product.imagen_url || '',
        activo: true,
        tiene_variantes: product.tiene_variantes,
      };

      const createdProduct = await productsCrud.create(productData);
      console.log(`Producto creado: ${product.nombre}`);

      if (product.tiene_variantes && product.variants) {
        for (const variant of product.variants) {
          const variantData = {
            product_id: createdProduct.id,
            nombre: variant.nombre,
            precio_adicional: variant.precio_adicional,
          };
          await variantsCrud.create(variantData);
          console.log(`  Variante creada: ${variant.nombre}`);
        }
      }
    }

    console.log('Productos semilla creados exitosamente');
    return { success: true };
  } catch (error) {
    console.error('Error al crear productos semilla:', error);
    return { success: false, error };
  }
}
