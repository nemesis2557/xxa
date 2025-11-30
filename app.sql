
-- Tabla de empleados (extensión de users)
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    sexo VARCHAR(10) CHECK (sexo IN ('Masculino', 'Femenino', 'Otro')),
    dni VARCHAR(8) NOT NULL UNIQUE,
    celular VARCHAR(9),
    avatar_url TEXT,
    estado BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear perfil por defecto para el admin (user_id = 1)
INSERT INTO employees (user_id, nombre, apellido, sexo, dni, celular) 
VALUES (1, 'Administrador', 'Sistema', 'Otro', '00000001', '999999999');

CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_dni ON employees(dni);

-- Habilitar RLS para employees
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY employees_select_policy ON employees
    FOR SELECT USING (user_id = uid());

CREATE POLICY employees_insert_policy ON employees
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY employees_update_policy ON employees
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY employees_delete_policy ON employees
    FOR DELETE USING (user_id = uid());

-- Tabla de categorías (sin RLS, compartida globalmente)
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    orden INTEGER DEFAULT 0,
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_orden ON categories(orden);

-- Insertar categorías del menú
INSERT INTO categories (nombre, slug, orden, imagen_url) VALUES
('Premium', 'premium', 1, '/img-carta/premium/categoria.webp'),
('Calientes', 'calientes', 2, '/img-carta/calientes/categoria.webp'),
('Heladas y al Tiempo', 'heladas-tiempo', 3, '/img-carta/heladas-tiempo/categoria.webp'),
('Andinos', 'andinos', 4, '/img-carta/andinos/categoria.webp'),
('Tradicional', 'tradicional', 5, '/img-carta/tradicional/categoria.webp'),
('Fast Food', 'fast-food', 6, '/img-carta/fast-food/categoria.webp'),
('Para Almorzar', 'para-almorzar', 7, '/img-carta/para-almorzar/categoria.webp'),
('Sandwich', 'sandwiches', 8, '/img-carta/sandwiches/categoria.webp'),
('Para Acompañar', 'para-acompanar', 9, '/img-carta/para-acompanar/categoria.webp'),
('Cervezas', 'cervezas', 10, '/img-carta/cervezas/categoria.webp'),
('Cocteles', 'cocteles', 11, '/img-carta/cocteles/categoria.webp'),
('Vinos', 'vinos', 12, '/img-carta/vinos/categoria.webp'),
('Gaseosas', 'gaseosas', 13, '/img-carta/gaseosas/categoria.webp');

-- Tabla de productos (sin RLS, compartida globalmente)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true NOT NULL,
    tiene_variantes BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_activo ON products(activo);

-- Insertar productos de ejemplo por categoría
-- PREMIUM
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(1, 'Menú de 5 Tiempos', 'Menú completo con entrada, sopa, plato de fondo, postre y bebida', 70.00, '/img-carta/premium/menu-5-tiempos.webp', false),
(1, 'Buffet', 'Buffet libre con variedad de platos calientes y fríos', 70.00, '/img-carta/premium/buffet.webp', false);

-- CALIENTES
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(2, 'Espresso', 'Café espresso italiano', 8.00, '/img-carta/calientes/espresso.webp', false),
(2, 'Latte / Capuccino', 'Café con leche espumosa', 10.00, '/img-carta/calientes/latte.webp', false),
(2, 'Americano', 'Café americano clásico', 7.00, '/img-carta/calientes/americano.webp', false),
(2, 'Chocolate', 'Chocolate caliente cremoso', 9.00, '/img-carta/calientes/chocolate.webp', false),
(2, 'Mocaccino', 'Mezcla de café y chocolate', 11.00, '/img-carta/calientes/mocaccino.webp', false),
(2, 'Lágrima', 'Leche con un toque de café', 8.00, '/img-carta/calientes/lagrima.webp', false),
(2, 'Ponche Andino', 'Bebida caliente tradicional andina', 12.00, '/img-carta/calientes/ponche-andino.webp', false),
(2, 'Infusiones Andinas', 'Té de hierbas andinas', 7.00, '/img-carta/calientes/infusiones-andinas.webp', false),
(2, 'Infusiones Importadas', 'Té importado premium', 9.00, '/img-carta/calientes/infusiones-importadas.webp', false),
(2, 'Té Jamaica', 'Té de flor de Jamaica', 8.00, '/img-carta/calientes/te-jamaica.webp', false),
(2, 'Té Luwak', 'Té especial de la casa', 10.00, '/img-carta/calientes/te-luwak.webp', false),
(2, 'Emoliente', 'Bebida caliente tradicional peruana', 6.00, '/img-carta/calientes/emoliente.webp', false),
(2, 'Emoliente con Licor', 'Emoliente con licor a elección', 12.00, '/img-carta/calientes/emoliente-licor.webp', true),
(2, 'Té con Licor', 'Té caliente con licor', 12.00, '/img-carta/calientes/te-licor.webp', true),
(2, 'Matagripe', 'Bebida caliente medicinal', 10.00, '/img-carta/calientes/matagripe.webp', false);

-- HELADAS Y AL TIEMPO
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(3, 'Milkshake', 'Batido cremoso de leche', 10.00, '/img-carta/heladas-tiempo/milkshake.webp', true),
(3, 'Frapuccino', 'Café helado batido', 12.00, '/img-carta/heladas-tiempo/frapuccino.webp', true),
(3, 'Jugos Naturales', 'Jugos de frutas frescas', 8.00, '/img-carta/heladas-tiempo/jugos.webp', true),
(3, 'Refrescos', 'Refrescos naturales', 6.00, '/img-carta/heladas-tiempo/refrescos.webp', true);

-- ANDINOS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(4, 'Charqui', 'Carne seca andina tradicional', 25.00, '/img-carta/andinos/charqui.webp', false),
(4, 'Tripitas de Cuy', 'Plato tradicional andino', 28.00, '/img-carta/andinos/tripitas-cuy.webp', false),
(4, 'Combo Luwak', 'Combinación especial de platos andinos', 35.00, '/img-carta/andinos/combo-luwak.webp', false);

-- TRADICIONAL
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(5, 'Lomo Saltado', 'Plato tradicional peruano', 28.00, '/img-carta/tradicional/lomo-saltado.webp', false),
(5, 'Parrillada', 'Parrilla mixta de carnes', 45.00, '/img-carta/tradicional/parrillada.webp', false),
(5, 'Anticuchos', 'Brochetas de corazón', 22.00, '/img-carta/tradicional/anticuchos.webp', false);

-- FAST FOOD
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(6, 'Salchipapas', 'Papas fritas con salchicha', 15.00, '/img-carta/fast-food/salchipapas.webp', false),
(6, 'Hamburguesa', 'Hamburguesa clásica', 18.00, '/img-carta/fast-food/hamburguesa.webp', false),
(6, 'Alitas', 'Alitas de pollo', 20.00, '/img-carta/fast-food/alitas.webp', true),
(6, 'Tequeños', 'Tequeños de queso', 12.00, '/img-carta/fast-food/tequenos.webp', false);

-- PARA ALMORZAR
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(7, 'Bisteck a lo Pobre', 'Bisteck con huevo, plátano y papas', 25.00, '/img-carta/para-almorzar/bisteck-pobre.webp', false),
(7, 'Milanesa', 'Milanesa de carne o pollo', 22.00, '/img-carta/para-almorzar/milanesa.webp', false),
(7, 'Arroz a la Cubana', 'Arroz con huevo frito y plátano', 18.00, '/img-carta/para-almorzar/arroz-cubana.webp', false);

-- SANDWICHES
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(8, 'Filete de Pollo', 'Sandwich de filete de pollo', 15.00, '/img-carta/sandwiches/filete-pollo.webp', false),
(8, 'Lomo Fino', 'Sandwich de lomo fino', 18.00, '/img-carta/sandwiches/lomo-fino.webp', false),
(8, 'Club Sandwich', 'Sandwich triple clásico', 16.00, '/img-carta/sandwiches/club-sandwich.webp', false),
(8, 'Triple', 'Sandwich triple especial', 17.00, '/img-carta/sandwiches/triple.webp', false),
(8, 'Crepes', 'Crepes dulces o salados', 14.00, '/img-carta/sandwiches/crepes.webp', false);

-- PARA ACOMPAÑAR
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(9, 'Pan con Chicharrón', 'Pan con chicharrón tradicional', 12.00, '/img-carta/para-acompanar/pan-chicharron.webp', false),
(9, 'Pan con Huevo', 'Pan con huevo frito', 8.00, '/img-carta/para-acompanar/pan-huevo.webp', false),
(9, 'Humitas', 'Humitas de choclo', 6.00, '/img-carta/para-acompanar/humitas.webp', false);

-- CERVEZAS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(10, 'Cerveza Nacional', 'Cerveza peruana', 8.00, '/img-carta/cervezas/nacional.webp', false),
(10, 'Cerveza Importada', 'Cerveza importada premium', 12.00, '/img-carta/cervezas/importada.webp', false);

-- COCTELES
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(11, 'Pisco Sour', 'Coctel peruano clásico', 18.00, '/img-carta/cocteles/pisco-sour.webp', false),
(11, 'Mojito', 'Coctel refrescante', 16.00, '/img-carta/cocteles/mojito.webp', false);

-- VINOS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(12, 'Vino Tinto', 'Vino tinto de la casa', 25.00, '/img-carta/vinos/tinto.webp', false),
(12, 'Vino Blanco', 'Vino blanco de la casa', 25.00, '/img-carta/vinos/blanco.webp', false);

-- GASEOSAS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
(13, 'Gaseosa Personal', 'Gaseosa 500ml', 4.00, '/img-carta/gaseosas/personal.webp', false),
(13, 'Gaseosa Familiar', 'Gaseosa 1.5L', 8.00, '/img-carta/gaseosas/familiar.webp', false);

-- Tabla de variantes de productos (sin RLS, compartida globalmente)
CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio_adicional DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- Insertar variantes para productos que las tienen
-- Milkshake variantes
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
((SELECT id FROM products WHERE nombre = 'Milkshake'), 'Vainilla', 0.00),
((SELECT id FROM products WHERE nombre = 'Milkshake'), 'Chocolate', 0.00),
((SELECT id FROM products WHERE nombre = 'Milkshake'), 'Café', 0.00),
((SELECT id FROM products WHERE nombre = 'Milkshake'), 'Lúcuma', 0.00),
((SELECT id FROM products WHERE nombre = 'Milkshake'), 'Fresa', 0.00);

-- Frapuccino variantes
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
((SELECT id FROM products WHERE nombre = 'Frapuccino'), 'Vainilla', 0.00),
((SELECT id FROM products WHERE nombre = 'Frapuccino'), 'Chocolate', 0.00),
((SELECT id FROM products WHERE nombre = 'Frapuccino'), 'Café', 0.00),
((SELECT id FROM products WHERE nombre = 'Frapuccino'), 'Lúcuma', 0.00),
((SELECT id FROM products WHERE nombre = 'Frapuccino'), 'Fresa', 0.00);

-- Jugos variantes
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
((SELECT id FROM products WHERE nombre = 'Jugos Naturales'), 'Fresa', 0.00),
((SELECT id FROM products WHERE nombre = 'Jugos Naturales'), 'Piña', 0.00),
((SELECT id FROM products WHERE nombre = 'Jugos Naturales'), 'Plátano', 0.00),
((SELECT id FROM products WHERE nombre = 'Jugos Naturales'), 'Papaya', 0.00);

-- Refrescos variantes
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
((SELECT id FROM products WHERE nombre = 'Refrescos'), 'Limonada', 0.00),
((SELECT id FROM products WHERE nombre = 'Refrescos'), 'Naranjada', 0.00),
((SELECT id FROM products WHERE nombre = 'Refrescos'), 'Maracuyá', 0.00);

-- Emoliente con Licor variantes
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
((SELECT id FROM products WHERE nombre = 'Emoliente con Licor'), 'Pisco', 0.00),
((SELECT id FROM products WHERE nombre = 'Emoliente con Licor'), 'Ron', 0.00),
((SELECT id FROM products WHERE nombre = 'Emoliente con Licor'), 'Anís', 0.00),
((SELECT id FROM products WHERE nombre = 'Emoliente con Licor'), 'Pulkay', 0.00);

-- Té con Licor variantes
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
((SELECT id FROM products WHERE nombre = 'Té con Licor'), 'Pisco', 0.00),
((SELECT id FROM products WHERE nombre = 'Té con Licor'), 'Ron', 0.00),
((SELECT id FROM products WHERE nombre = 'Té con Licor'), 'Anís', 0.00),
((SELECT id FROM products WHERE nombre = 'Té con Licor'), 'Pulkay', 0.00);

-- Alitas variantes
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
((SELECT id FROM products WHERE nombre = 'Alitas'), 'BBQ', 0.00),
((SELECT id FROM products WHERE nombre = 'Alitas'), 'Acevichada', 0.00),
((SELECT id FROM products WHERE nombre = 'Alitas'), 'Broster', 0.00),
((SELECT id FROM products WHERE nombre = 'Alitas'), 'Picantes', 0.00),
((SELECT id FROM products WHERE nombre = 'Alitas'), 'Mixto', 0.00);

-- Tabla de pedidos (con RLS)
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    numero_pedido SERIAL NOT NULL,
    descripcion_resumen TEXT,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' NOT NULL CHECK (estado IN ('pendiente', 'cocinando', 'listo', 'pagado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_estado ON orders(estado);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Habilitar RLS para orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_select_policy ON orders
    FOR SELECT USING (user_id = uid());

CREATE POLICY orders_insert_policy ON orders
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY orders_update_policy ON orders
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY orders_delete_policy ON orders
    FOR DELETE USING (user_id = uid());

-- Tabla de items de pedido (con RLS)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_id BIGINT,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_user_id ON order_items(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Habilitar RLS para order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_items_select_policy ON order_items
    FOR SELECT USING (user_id = uid());

CREATE POLICY order_items_insert_policy ON order_items
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY order_items_update_policy ON order_items
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY order_items_delete_policy ON order_items
    FOR DELETE USING (user_id = uid());

-- Tabla de pagos (con RLS)
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL UNIQUE,
    metodo VARCHAR(20) NOT NULL CHECK (metodo IN ('efectivo', 'yape')),
    numero_operacion VARCHAR(50),
    nombre_cliente VARCHAR(200),
    foto_yape_url TEXT,
    processed_by BIGINT NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_processed_by ON payments(processed_by);

-- Habilitar RLS para payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_select_policy ON payments
    FOR SELECT USING (user_id = uid());

CREATE POLICY payments_insert_policy ON payments
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY payments_update_policy ON payments
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY payments_delete_policy ON payments
    FOR DELETE USING (user_id = uid());

-- Tabla de notas de compra (con RLS)
CREATE TABLE shopping_notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shopping_notes_user_id ON shopping_notes(user_id);
CREATE INDEX idx_shopping_notes_created_by ON shopping_notes(created_by);
CREATE INDEX idx_shopping_notes_created_at ON shopping_notes(created_at);

-- Habilitar RLS para shopping_notes
ALTER TABLE shopping_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY shopping_notes_select_policy ON shopping_notes
    FOR SELECT USING (user_id = uid());

CREATE POLICY shopping_notes_insert_policy ON shopping_notes
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY shopping_notes_update_policy ON shopping_notes
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY shopping_notes_delete_policy ON shopping_notes
    FOR DELETE USING (user_id = uid());

-- Tabla de turnos (con RLS)
CREATE TABLE turnos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fin TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_turnos_user_id ON turnos(user_id);
CREATE INDEX idx_turnos_inicio ON turnos(inicio);

-- Habilitar RLS para turnos
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;

CREATE POLICY turnos_select_policy ON turnos
    FOR SELECT USING (user_id = uid());

CREATE POLICY turnos_insert_policy ON turnos
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY turnos_update_policy ON turnos
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY turnos_delete_policy ON turnos
    FOR DELETE USING (user_id = uid());

-- Agregar campo role_type a la tabla users para roles del sistema POS
ALTER TABLE users ADD COLUMN role_type VARCHAR(20) DEFAULT 'mesero';
ALTER TABLE users ADD CONSTRAINT users_role_type_check 
  CHECK (role_type IN ('admin', 'mesero', 'cajero', 'chef', 'ayudante'));

-- Agregar campo role_type a la tabla employees
ALTER TABLE employees ADD COLUMN role_type VARCHAR(20) DEFAULT 'mesero';
ALTER TABLE employees ADD CONSTRAINT employees_role_type_check 
  CHECK (role_type IN ('admin', 'mesero', 'cajero', 'chef', 'ayudante'));

-- Crear tabla system_config para configuraciones del sistema
CREATE TABLE system_config (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_config_key ON system_config(config_key);

-- Insertar configuración de clave de administrador por defecto
INSERT INTO system_config (config_key, config_value, description) 
VALUES ('admin_password', 'Admin2024*', 'Clave de administrador para operaciones protegidas');

-- Crear usuarios semilla con contraseñas hasheadas (bcrypt)
-- Nota: Las contraseñas reales serán hasheadas por el sistema de autenticación
-- Admin: LuwakAdmin123*
INSERT INTO users (email, password, role, role_type) 
VALUES ('admin@luwak.test', '$2a$10$placeholder_hash_admin', 'app20251127214152nuwafyrxyn_v1_admin_user', 'admin');

-- Mesero: LuwakMesero123*
INSERT INTO users (email, password, role, role_type) 
VALUES ('mesero@luwak.test', '$2a$10$placeholder_hash_mesero', 'app20251127214152nuwafyrxyn_v1_user', 'mesero');

-- Cajero: LuwakCajero123*
INSERT INTO users (email, password, role, role_type) 
VALUES ('cajero@luwak.test', '$2a$10$placeholder_hash_cajero', 'app20251127214152nuwafyrxyn_v1_user', 'cajero');

-- Chef: LuwakChef123*
INSERT INTO users (email, password, role, role_type) 
VALUES ('chef@luwak.test', '$2a$10$placeholder_hash_chef', 'app20251127214152nuwafyrxyn_v1_user', 'chef');

-- Ayudante: LuwakAyudante123*
INSERT INTO users (email, password, role, role_type) 
VALUES ('ayudante@luwak.test', '$2a$10$placeholder_hash_ayudante', 'app20251127214152nuwafyrxyn_v1_user', 'ayudante');

-- Crear perfiles de empleados para los usuarios semilla
INSERT INTO employees (user_id, nombre, apellido, sexo, dni, celular, role_type, estado)
VALUES 
  (1, 'Administrador', 'Sistema', 'otro', '00000001', '999000001', 'admin', true),
  (2, 'Carlos', 'Montana', 'masculino', '00000002', '999000002', 'mesero', true),
  (3, 'Ana', 'Torres', 'femenino', '00000003', '999000003', 'cajero', true),
  (4, 'Juan', 'Ramirez', 'masculino', '00000004', '999000004', 'chef', true),
  (5, 'Luis', 'Gomez', 'masculino', '00000005', '999000005', 'ayudante', true);

-- Insertar categorías del menú
INSERT INTO categories (nombre, slug, orden, imagen_url) VALUES
  ('Premium', 'premium', 1, '/img-carta/premium/category.webp'),
  ('Calientes', 'calientes', 2, '/img-carta/calientes/category.webp'),
  ('Heladas y al Tiempo', 'heladas-tiempo', 3, '/img-carta/heladas-tiempo/category.webp'),
  ('Andinos', 'andinos', 4, '/img-carta/andinos/category.webp'),
  ('Tradicional', 'tradicional', 5, '/img-carta/tradicional/category.webp'),
  ('Fast Food', 'fast-food', 6, '/img-carta/fast-food/category.webp'),
  ('Para Almorzar', 'para-almorzar', 7, '/img-carta/para-almorzar/category.webp'),
  ('Sandwich', 'sandwiches', 8, '/img-carta/sandwiches/category.webp'),
  ('Para Acompañar', 'para-acompanar', 9, '/img-carta/para-acompanar/category.webp'),
  ('Cervezas', 'cervezas', 10, '/img-carta/cervezas/category.webp'),
  ('Cocteles', 'cocteles', 11, '/img-carta/cocteles/category.webp'),
  ('Vinos', 'vinos', 12, '/img-carta/vinos/category.webp'),
  ('Gaseosas', 'gaseosas', 13, '/img-carta/gaseosas/category.webp');

-- Insertar productos de ejemplo por categoría

-- PREMIUM
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (1, 'Menú de 5 Tiempos', 'Experiencia gastronómica completa con entrada, sopa, plato fuerte, postre y bebida', 70.00, '/img-carta/premium/menu-5-tiempos.webp', false),
  (1, 'Buffet', 'Buffet libre con variedad de platos calientes y fríos', 70.00, '/img-carta/premium/buffet.webp', false);

-- CALIENTES
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (2, 'Espresso', 'Café espresso italiano', 8.00, '/img-carta/calientes/espresso.webp', false),
  (2, 'Latte / Capuccino', 'Café con leche espumosa', 12.00, '/img-carta/calientes/latte.webp', false),
  (2, 'Americano', 'Café americano clásico', 10.00, '/img-carta/calientes/americano.webp', false),
  (2, 'Chocolate', 'Chocolate caliente cremoso', 10.00, '/img-carta/calientes/chocolate.webp', false),
  (2, 'Emoliente', 'Bebida tradicional peruana', 6.00, '/img-carta/calientes/emoliente.webp', false),
  (2, 'Emoliente con Licor', 'Emoliente con licor a elección', 12.00, '/img-carta/calientes/emoliente-licor.webp', true),
  (2, 'Té Jamaica', 'Té de Jamaica refrescante', 8.00, '/img-carta/calientes/te-jamaica.webp', false),
  (2, 'Té Luwak', 'Té especial de la casa', 10.00, '/img-carta/calientes/te-luwak.webp', false);

-- Variantes para Emoliente con Licor
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
  (8, 'Pisco', 0.00),
  (8, 'Ron', 0.00),
  (8, 'Anís', 0.00),
  (8, 'Pulkay', 0.00);

-- HELADAS Y AL TIEMPO
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (3, 'Milkshake', 'Batido cremoso de helado', 15.00, '/img-carta/heladas-tiempo/milkshake.webp', true),
  (3, 'Frapuccino', 'Bebida helada de café', 16.00, '/img-carta/heladas-tiempo/frapuccino.webp', true),
  (3, 'Jugos Naturales', 'Jugos de frutas frescas', 10.00, '/img-carta/heladas-tiempo/jugos.webp', true),
  (3, 'Refrescos', 'Refrescos naturales', 8.00, '/img-carta/heladas-tiempo/refrescos.webp', true);

-- Variantes para Milkshake
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
  (9, 'Vainilla', 0.00),
  (9, 'Chocolate', 0.00),
  (9, 'Café', 0.00),
  (9, 'Lúcuma', 0.00),
  (9, 'Fresa', 0.00);

-- Variantes para Frapuccino
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
  (10, 'Vainilla', 0.00),
  (10, 'Chocolate', 0.00),
  (10, 'Café', 0.00),
  (10, 'Lúcuma', 0.00),
  (10, 'Fresa', 0.00);

-- Variantes para Jugos
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
  (11, 'Fresa', 0.00),
  (11, 'Piña', 0.00),
  (11, 'Plátano', 0.00),
  (11, 'Papaya', 0.00);

-- Variantes para Refrescos
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
  (12, 'Limonada', 0.00),
  (12, 'Naranjada', 0.00),
  (12, 'Maracuyá', 0.00);

-- ANDINOS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (4, 'Charqui', 'Carne seca andina tradicional', 25.00, '/img-carta/andinos/charqui.webp', false),
  (4, 'Tripitas de Cuy', 'Plato tradicional andino', 28.00, '/img-carta/andinos/tripitas-cuy.webp', false),
  (4, 'Combo Luwak', 'Combinación especial de platos andinos', 35.00, '/img-carta/andinos/combo-luwak.webp', false);

-- TRADICIONAL
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (5, 'Lomo Saltado', 'Clásico peruano con carne, papas y arroz', 28.00, '/img-carta/tradicional/lomo-saltado.webp', false),
  (5, 'Parrillada', 'Parrilla mixta para compartir', 45.00, '/img-carta/tradicional/parrillada.webp', false),
  (5, 'Anticuchos', 'Brochetas de corazón marinado', 22.00, '/img-carta/tradicional/anticuchos.webp', false);

-- FAST FOOD
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (6, 'Salchipapas', 'Papas fritas con salchichas', 15.00, '/img-carta/fast-food/salchipapas.webp', false),
  (6, 'Hamburguesa', 'Hamburguesa clásica con papas', 18.00, '/img-carta/fast-food/hamburguesa.webp', false),
  (6, 'Alitas', 'Alitas de pollo en salsa', 20.00, '/img-carta/fast-food/alitas.webp', true),
  (6, 'Tequeños', 'Tequeños de queso (6 unidades)', 12.00, '/img-carta/fast-food/tequenos.webp', false);

-- Variantes para Alitas
INSERT INTO product_variants (product_id, nombre, precio_adicional) VALUES
  (21, 'BBQ', 0.00),
  (21, 'Acevichada', 0.00),
  (21, 'Broster', 0.00),
  (21, 'Picantes', 0.00),
  (21, 'Mixto', 0.00);

-- PARA ALMORZAR
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (7, 'Bisteck a lo Pobre', 'Bisteck con huevo, plátano y papas', 25.00, '/img-carta/para-almorzar/bisteck-pobre.webp', false),
  (7, 'Milanesa', 'Milanesa de pollo o carne con arroz', 22.00, '/img-carta/para-almorzar/milanesa.webp', false),
  (7, 'Arroz a la Cubana', 'Arroz con huevo frito y plátano', 18.00, '/img-carta/para-almorzar/arroz-cubana.webp', false);

-- SANDWICH
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (8, 'Filete de Pollo', 'Sandwich de filete de pollo', 16.00, '/img-carta/sandwiches/filete-pollo.webp', false),
  (8, 'Lomo Fino', 'Sandwich de lomo fino', 18.00, '/img-carta/sandwiches/lomo-fino.webp', false),
  (8, 'Club Sandwich', 'Sandwich triple clásico', 20.00, '/img-carta/sandwiches/club-sandwich.webp', false),
  (8, 'Crepes', 'Crepes dulces o salados', 14.00, '/img-carta/sandwiches/crepes.webp', false);

-- PARA ACOMPAÑAR
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (9, 'Pan con Chicharrón', 'Pan con chicharrón tradicional', 12.00, '/img-carta/para-acompanar/pan-chicharron.webp', false),
  (9, 'Pan con Huevo', 'Pan con huevo frito', 8.00, '/img-carta/para-acompanar/pan-huevo.webp', false),
  (9, 'Humitas', 'Humitas dulces o saladas (2 unidades)', 10.00, '/img-carta/para-acompanar/humitas.webp', false);

-- CERVEZAS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (10, 'Cerveza Nacional', 'Cerveza peruana 330ml', 8.00, '/img-carta/cervezas/nacional.webp', false),
  (10, 'Cerveza Importada', 'Cerveza importada 330ml', 12.00, '/img-carta/cervezas/importada.webp', false);

-- COCTELES
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (11, 'Pisco Sour', 'Coctel peruano clásico', 18.00, '/img-carta/cocteles/pisco-sour.webp', false),
  (11, 'Mojito', 'Mojito refrescante', 16.00, '/img-carta/cocteles/mojito.webp', false),
  (11, 'Chilcano', 'Chilcano de pisco', 15.00, '/img-carta/cocteles/chilcano.webp', false);

-- VINOS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (12, 'Vino Tinto', 'Copa de vino tinto', 15.00, '/img-carta/vinos/tinto.webp', false),
  (12, 'Vino Blanco', 'Copa de vino blanco', 15.00, '/img-carta/vinos/blanco.webp', false);

-- GASEOSAS
INSERT INTO products (category_id, nombre, descripcion, precio, imagen_url, tiene_variantes) VALUES
  (13, 'Gaseosa Personal', 'Gaseosa 500ml', 5.00, '/img-carta/gaseosas/personal.webp', false),
  (13, 'Gaseosa Familiar', 'Gaseosa 1.5L', 8.00, '/img-carta/gaseosas/familiar.webp', false);

-- Crear trigger para actualizar updated_at en system_config
CREATE TRIGGER update_system_config_updated_at
    BEFORE UPDATE ON system_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Agregar campo username a la tabla users
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Actualizar la tabla users para los usuarios de prueba con contraseñas simples
-- Usuario Admin
UPDATE users SET 
    username = 'admin',
    password = 'admin123',
    role_type = 'admin',
    email = 'admin@luwak.com'
WHERE id = 1;

-- Si no existe el usuario admin, crearlo
INSERT INTO users (id, username, email, password, role_type, role)
SELECT 1, 'admin', 'admin@luwak.com', 'admin123', 'admin', 'app20251127214152nuwafyrxyn_v1_admin_user'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);

-- Crear/actualizar empleado para admin
INSERT INTO employees (id, user_id, nombre, apellido, dni, role_type, estado)
VALUES (1, 1, 'Administrador', 'Sistema', '12345678', 'admin', true)
ON CONFLICT (id) DO UPDATE SET
    user_id = 1,
    nombre = 'Administrador',
    apellido = 'Sistema',
    role_type = 'admin';

-- Usuario Mesero
INSERT INTO users (username, email, password, role_type, role)
VALUES ('mesero', 'mesero@luwak.com', 'mesero123', 'mesero', 'app20251127214152nuwafyrxyn_v1_user')
ON CONFLICT (username) DO UPDATE SET
    password = 'mesero123',
    role_type = 'mesero';

-- Empleado Mesero
INSERT INTO employees (user_id, nombre, apellido, dni, role_type, estado)
SELECT u.id, 'Carlos', 'Montana', '23456789', 'mesero', true
FROM users u WHERE u.username = 'mesero'
ON CONFLICT (dni) DO UPDATE SET
    nombre = 'Carlos',
    apellido = 'Montana',
    role_type = 'mesero';

-- Usuario Cajero
INSERT INTO users (username, email, password, role_type, role)
VALUES ('cajero', 'cajero@luwak.com', 'cajero123', 'cajero', 'app20251127214152nuwafyrxyn_v1_user')
ON CONFLICT (username) DO UPDATE SET
    password = 'cajero123',
    role_type = 'cajero';

-- Empleado Cajero
INSERT INTO employees (user_id, nombre, apellido, dni, role_type, estado)
SELECT u.id, 'Ana', 'Rodriguez', '34567890', 'cajero', true
FROM users u WHERE u.username = 'cajero'
ON CONFLICT (dni) DO UPDATE SET
    nombre = 'Ana',
    apellido = 'Rodriguez',
    role_type = 'cajero';

-- Usuario Chef
INSERT INTO users (username, email, password, role_type, role)
VALUES ('chef', 'chef@luwak.com', 'chef123', 'chef', 'app20251127214152nuwafyrxyn_v1_user')
ON CONFLICT (username) DO UPDATE SET
    password = 'chef123',
    role_type = 'chef';

-- Empleado Chef
INSERT INTO employees (user_id, nombre, apellido, dni, role_type, estado)
SELECT u.id, 'Juan', 'Perez', '45678901', 'chef', true
FROM users u WHERE u.username = 'chef'
ON CONFLICT (dni) DO UPDATE SET
    nombre = 'Juan',
    apellido = 'Perez',
    role_type = 'chef';

-- Usuario Ayudante
INSERT INTO users (username, email, password, role_type, role)
VALUES ('ayudante', 'ayudante@luwak.com', 'ayudante123', 'ayudante', 'app20251127214152nuwafyrxyn_v1_user')
ON CONFLICT (username) DO UPDATE SET
    password = 'ayudante123',
    role_type = 'ayudante';

-- Empleado Ayudante
INSERT INTO employees (user_id, nombre, apellido, dni, role_type, estado)
SELECT u.id, 'Luis', 'Garcia', '56789012', 'ayudante', true
FROM users u WHERE u.username = 'ayudante'
ON CONFLICT (dni) DO UPDATE SET
    nombre = 'Luis',
    apellido = 'Garcia',
    role_type = 'ayudante';

-- Agregar clave de administrador al sistema
INSERT INTO system_config (config_key, config_value, description)
VALUES ('admin_password', 'admin2024', 'Clave de administrador para operaciones críticas')
ON CONFLICT (config_key) DO UPDATE SET
    config_value = 'admin2024';

-- Crear índice en username para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insertar usuarios de prueba en la tabla users existente
-- Nota: Las contraseñas están en texto plano para facilitar las pruebas

INSERT INTO users (email, password, username, role_type, role, created_at, updated_at) VALUES
('admin@luwak.com', 'admin123', 'admin', 'admin', 'app20251127214152nuwafyrxyn_v1_admin_user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mesero@luwak.com', 'mesero123', 'mesero1', 'mesero', 'app20251127214152nuwafyrxyn_v1_user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cajero@luwak.com', 'cajero123', 'cajero1', 'cajero', 'app20251127214152nuwafyrxyn_v1_user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('chef@luwak.com', 'chef123', 'chef1', 'chef', 'app20251127214152nuwafyrxyn_v1_user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ayudante@luwak.com', 'ayudante123', 'ayudante1', 'ayudante', 'app20251127214152nuwafyrxyn_v1_user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO UPDATE SET
  password = EXCLUDED.password,
  email = EXCLUDED.email,
  role_type = EXCLUDED.role_type,
  updated_at = CURRENT_TIMESTAMP;

-- Insertar empleados correspondientes a cada usuario
INSERT INTO employees (user_id, nombre, apellido, sexo, dni, celular, role_type, estado, created_at, updated_at) VALUES
(1, 'Carlos', 'Administrador', 'masculino', '12345678', '987654321', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Juan', 'Pérez', 'masculino', '23456789', '987654322', 'mesero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'María', 'González', 'femenino', '34567890', '987654323', 'cajero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Pedro', 'Ramírez', 'masculino', '45678901', '987654324', 'chef', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Ana', 'Torres', 'femenino', '56789012', '987654325', 'ayudante', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (dni) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido,
  celular = EXCLUDED.celular,
  updated_at = CURRENT_TIMESTAMP;

-- Insertar configuración del sistema para la clave de administrador
INSERT INTO system_config (config_key, config_value, description, created_at, updated_at) VALUES
('admin_password', 'admin2024', 'Clave maestra del administrador para operaciones críticas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (config_key) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  updated_at = CURRENT_TIMESTAMP;

-- Insertar usuarios de prueba en la tabla users
-- Estos usuarios coinciden con los que mencionaste: admin, mesero1, cajero1, chef1, ayudante1

INSERT INTO users (email, password, username, role_type, role) VALUES
('admin@luwak.com', 'admin123', 'admin', 'admin', 'app20251127214152nuwafyrxyn_v1_admin_user'),
('mesero1@luwak.com', 'mesero123', 'mesero1', 'mesero', 'app20251127214152nuwafyrxyn_v1_user'),
('cajero1@luwak.com', 'cajero123', 'cajero1', 'cajero', 'app20251127214152nuwafyrxyn_v1_user'),
('chef1@luwak.com', 'chef123', 'chef1', 'chef', 'app20251127214152nuwafyrxyn_v1_user'),
('ayudante1@luwak.com', 'ayudante123', 'ayudante1', 'ayudante', 'app20251127214152nuwafyrxyn_v1_user')
ON CONFLICT (username) DO NOTHING;

-- Insertar empleados correspondientes a cada usuario
INSERT INTO employees (user_id, nombre, apellido, sexo, dni, celular, role_type, estado) VALUES
(1, 'Carlos', 'Administrador', 'masculino', '12345678', '987654321', 'admin', true),
(2, 'Juan', 'Pérez', 'masculino', '23456789', '987654322', 'mesero', true),
(3, 'María', 'González', 'femenino', '34567890', '987654323', 'cajero', true),
(4, 'Pedro', 'Ramírez', 'masculino', '45678901', '987654324', 'chef', true),
(5, 'Ana', 'Torres', 'femenino', '56789012', '987654325', 'ayudante', true)
ON CONFLICT (dni) DO NOTHING;

-- Insertar configuración del sistema para la clave de administrador
INSERT INTO system_config (config_key, config_value, description) VALUES
('admin_password', 'admin2024', 'Clave maestra del administrador para operaciones críticas')
ON CONFLICT (config_key) DO UPDATE SET config_value = 'admin2024';
