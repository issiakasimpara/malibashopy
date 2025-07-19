import { pgTable, uuid, text, timestamp, boolean, decimal, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// 🏪 STORES TABLE
// ========================================
export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  logo: text('logo'),
  domain: text('domain'),
  subdomain: text('subdomain'),
  isActive: boolean('is_active').default(true),
  ownerId: text('owner_id').notNull(), // Clerk User ID
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 📦 PRODUCTS TABLE
// ========================================
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  images: jsonb('images').$type<string[]>().default([]),
  category: text('category'),
  tags: text('tags').array(),
  inventory: integer('inventory').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🛒 ORDERS TABLE
// ========================================
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone'),
  shippingAddress: jsonb('shipping_address').$type<{
    street: string;
    city: string;
    country: string;
    postalCode?: string;
  }>().notNull(),
  status: text('status').notNull().default('pending'), // pending, confirmed, shipped, delivered, cancelled
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  paymentStatus: text('payment_status').default('pending'), // pending, paid, failed
  paymentMethod: text('payment_method'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 📋 ORDER ITEMS TABLE
// ========================================
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  productName: text('product_name').notNull(), // Snapshot du nom au moment de la commande
  productImage: text('product_image'), // Snapshot de l'image
});

// ========================================
// 🌍 MARKET SETTINGS TABLE
// ========================================
export const marketSettings = pgTable('market_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  enabledCountries: text('enabled_countries').array().notNull().default([]),
  defaultCurrency: text('default_currency').notNull().default('XOF'),
  taxSettings: jsonb('tax_settings').$type<{
    includeTax: boolean;
    taxRate: number;
    taxLabel: string;
  }>().default({
    includeTax: false,
    taxRate: 0,
    taxLabel: 'TVA'
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🚚 SHIPPING METHODS TABLE
// ========================================
export const shippingMethods = pgTable('shipping_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
  estimatedDays: text('estimated_days').notNull(),
  icon: text('icon').notNull().default('📦'),
  isActive: boolean('is_active').notNull().default(true),
  availableCountries: text('available_countries').array().default([]),
  conditions: jsonb('conditions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🔗 RELATIONS
// ========================================
export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  orders: many(orders),
  marketSettings: many(marketSettings),
  shippingMethods: many(shippingMethods),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const marketSettingsRelations = relations(marketSettings, ({ one }) => ({
  store: one(stores, {
    fields: [marketSettings.storeId],
    references: [stores.id],
  }),
}));

export const shippingMethodsRelations = relations(shippingMethods, ({ one }) => ({
  store: one(stores, {
    fields: [shippingMethods.storeId],
    references: [stores.id],
  }),
}));
