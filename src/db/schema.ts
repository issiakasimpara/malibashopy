import { pgTable, uuid, text, timestamp, boolean, decimal, jsonb, integer, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ========================================
// 🔧 ENUMS
// ========================================
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);
export const productStatusEnum = pgEnum('product_status', ['draft', 'active', 'archived']);

// ========================================
// 👤 PROFILES TABLE
// ========================================
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🏪 STORES TABLE (EXTENDED)
// ========================================
export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  merchantId: uuid('merchant_id'),
  userId: uuid('user_id'),
  status: text('status').default('active'),
  logoUrl: text('logo_url'),
  settings: jsonb('settings').default({}),
  // Compatibilité ancienne version
  logo: text('logo'),
  domain: text('domain'),
  subdomain: text('subdomain'),
  isActive: boolean('is_active').default(true),
  ownerId: text('owner_id'), // Clerk User ID
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 📂 CATEGORIES TABLE
// ========================================
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ========================================
// 👥 CUSTOMERS TABLE
// ========================================
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  address: jsonb('address').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🏷️ PRODUCT ATTRIBUTES TABLE
// ========================================
export const productAttributes = pgTable('product_attributes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🎨 ATTRIBUTE VALUES TABLE
// ========================================
export const attributeValues = pgTable('attribute_values', {
  id: uuid('id').primaryKey().defaultRandom(),
  attributeId: uuid('attribute_id').notNull().references(() => productAttributes.id, { onDelete: 'cascade' }),
  value: text('value').notNull(),
  hexColor: text('hex_color'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// ========================================
// 📦 PRODUCTS TABLE (EXTENDED)
// ========================================
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal('compare_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  sku: text('sku'),
  inventoryQuantity: integer('inventory_quantity').default(0),
  status: productStatusEnum('status').default('draft'),
  images: text('images').array().default([]),
  tags: text('tags').array().default([]),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  dimensions: jsonb('dimensions').default({}),
  trackInventory: boolean('track_inventory').default(true),
  // Compatibilité ancienne version
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  category: text('category'),
  inventory: integer('inventory').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🎯 PRODUCT VARIANTS TABLE
// ========================================
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku'),
  price: decimal('price', { precision: 10, scale: 2 }),
  comparePrice: decimal('compare_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  inventoryQuantity: integer('inventory_quantity').default(0),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  images: text('images').array(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🔗 VARIANT ATTRIBUTE VALUES TABLE
// ========================================
export const variantAttributeValues = pgTable('variant_attribute_values', {
  id: uuid('id').primaryKey().defaultRandom(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  attributeValueId: uuid('attribute_value_id').notNull().references(() => attributeValues.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// ========================================
// 🛒 ORDERS TABLE (EXTENDED)
// ========================================
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => customers.id),
  orderNumber: text('order_number').notNull(),
  status: orderStatusEnum('status').default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).default('0'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).default('0'),
  currency: text('currency').default('CFA'),
  billingAddress: jsonb('billing_address').default({}),
  shippingAddress: jsonb('shipping_address').default({}),
  notes: text('notes'),
  // Compatibilité ancienne version
  customerEmail: text('customer_email'),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  paymentStatus: text('payment_status').default('pending'),
  paymentMethod: text('payment_method'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🛒 PUBLIC ORDERS TABLE
// ========================================
export const publicOrders = pgTable('public_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: text('order_number').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  storeId: uuid('store_id').references(() => stores.id),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).default('0'),
  currency: text('currency').default('EUR'),
  status: text('status').default('pending'),
  items: jsonb('items').default([]),
  shippingAddress: jsonb('shipping_address'),
  billingAddress: jsonb('billing_address'),
  shippingMethod: jsonb('shipping_method'),
  shippingCountry: text('shipping_country'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 📋 ORDER ITEMS TABLE (EXTENDED)
// ========================================
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  // Compatibilité ancienne version
  productName: text('product_name'), // Snapshot du nom au moment de la commande
  productImage: text('product_image'), // Snapshot de l'image
  createdAt: timestamp('created_at').defaultNow(),
});

// ========================================
// 🛍️ CART SESSIONS TABLE
// ========================================
export const cartSessions = pgTable('cart_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  storeId: uuid('store_id').references(() => stores.id),
  items: jsonb('items').default([]),
  customerInfo: jsonb('customer_info'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});

// ========================================
// 📍 SHIPPING ADDRESSES TABLE
// ========================================
export const shippingAddresses = pgTable('shipping_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id),
  country: varchar('country', { length: 10 }).notNull(),
  city: varchar('city', { length: 255 }),
  addressLine: text('address_line'),
  postalCode: varchar('postal_code', { length: 20 }),
  phone: varchar('phone', { length: 30 }),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// ========================================
// 🌍 MARKETS TABLE
// ========================================
export const markets = pgTable('markets', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  countries: text('countries').array().default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🌍 MARKET SETTINGS TABLE (LEGACY)
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
// 🚚 SHIPPING METHODS TABLE (EXTENDED)
// ========================================
export const shippingMethods = pgTable('shipping_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  marketId: uuid('market_id').references(() => markets.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.0'),
  estimatedMinDays: integer('estimated_min_days').default(1),
  estimatedMaxDays: integer('estimated_max_days').default(7),
  isActive: boolean('is_active').default(true),
  conditions: jsonb('conditions'),
  sortOrder: integer('sort_order').default(0),
  // Compatibilité ancienne version
  estimatedDays: text('estimated_days'),
  icon: text('icon').default('📦'),
  availableCountries: text('available_countries').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🌐 DOMAINS TABLE
// ========================================
export const domains = pgTable('domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  domainName: text('domain_name').notNull(),
  status: text('status').default('pending'),
  sslStatus: text('ssl_status').default('pending'),
  isVerified: boolean('is_verified').default(false),
  verificationToken: text('verification_token'),
  lastVerifiedAt: timestamp('last_verified_at'),
  errorMessage: text('error_message'),
  vercelDomainId: text('vercel_domain_id'),
  cnameTarget: text('cname_target'),
  awsAmplifyAppId: text('aws_amplify_app_id'),
  awsDomainName: text('aws_domain_name'),
  awsDeploymentUrl: text('aws_deployment_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🔒 CUSTOM DOMAINS TABLE
// ========================================
export const customDomains = pgTable('custom_domains', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  customDomain: text('custom_domain').notNull(),
  verificationToken: text('verification_token').notNull(),
  verified: boolean('verified').default(false),
  sslEnabled: boolean('ssl_enabled').default(false),
  cloudflareZoneId: text('cloudflare_zone_id'),
  cloudflareRecordId: text('cloudflare_record_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 📡 DNS RECORDS TABLE
// ========================================
export const dnsRecords = pgTable('dns_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  domainId: uuid('domain_id').notNull().references(() => domains.id, { onDelete: 'cascade' }),
  cloudflareRecordId: text('cloudflare_record_id'),
  recordType: text('record_type').notNull(),
  name: text('name').notNull(),
  value: text('value').notNull(),
  ttl: integer('ttl').default(3600),
  proxied: boolean('proxied').default(true),
  priority: integer('priority'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🔐 SSL CERTIFICATES TABLE
// ========================================
export const sslCertificates = pgTable('ssl_certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  domainId: uuid('domain_id').notNull().references(() => domains.id, { onDelete: 'cascade' }),
  cloudflareCertId: text('cloudflare_cert_id'),
  status: text('status').default('pending'),
  issuedAt: timestamp('issued_at'),
  expiresAt: timestamp('expires_at'),
  autoRenew: boolean('auto_renew').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🎨 SITE TEMPLATES TABLE
// ========================================
export const siteTemplates = pgTable('site_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull(),
  templateData: jsonb('template_data').notNull(),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 💬 TESTIMONIALS TABLE
// ========================================
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: text('store_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  rating: integer('rating').notNull(),
  title: text('title'),
  content: text('content').notNull(),
  isApproved: boolean('is_approved').default(false),
  isFeatured: boolean('is_featured').default(false),
  orderId: text('order_id'),
  productId: text('product_id'),
  customerImage: text('customer_image'),
  images: text('images').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ========================================
// 🔗 RELATIONS
// ========================================
export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  orders: many(orders),
  publicOrders: many(publicOrders),
  categories: many(categories),
  customers: many(customers),
  markets: many(markets),
  marketSettings: many(marketSettings),
  shippingMethods: many(shippingMethods),
  cartSessions: many(cartSessions),
  domains: many(domains),
  customDomains: many(customDomains),
  siteTemplates: many(siteTemplates),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  store: one(stores, {
    fields: [customers.storeId],
    references: [stores.id],
  }),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  attributeValues: many(variantAttributeValues),
}));

export const productAttributesRelations = relations(productAttributes, ({ many }) => ({
  values: many(attributeValues),
}));

export const attributeValuesRelations = relations(attributeValues, ({ one, many }) => ({
  attribute: one(productAttributes, {
    fields: [attributeValues.attributeId],
    references: [productAttributes.id],
  }),
  variantValues: many(variantAttributeValues),
}));

export const variantAttributeValuesRelations = relations(variantAttributeValues, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantAttributeValues.variantId],
    references: [productVariants.id],
  }),
  attributeValue: one(attributeValues, {
    fields: [variantAttributeValues.attributeValueId],
    references: [attributeValues.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  orderItems: many(orderItems),
  shippingAddresses: many(shippingAddresses),
}));

export const publicOrdersRelations = relations(publicOrders, ({ one }) => ({
  store: one(stores, {
    fields: [publicOrders.storeId],
    references: [stores.id],
  }),
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

export const cartSessionsRelations = relations(cartSessions, ({ one }) => ({
  store: one(stores, {
    fields: [cartSessions.storeId],
    references: [stores.id],
  }),
}));

export const shippingAddressesRelations = relations(shippingAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [shippingAddresses.orderId],
    references: [orders.id],
  }),
}));

export const marketsRelations = relations(markets, ({ one, many }) => ({
  store: one(stores, {
    fields: [markets.storeId],
    references: [stores.id],
  }),
  shippingMethods: many(shippingMethods),
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
  market: one(markets, {
    fields: [shippingMethods.marketId],
    references: [markets.id],
  }),
}));

export const domainsRelations = relations(domains, ({ one, many }) => ({
  store: one(stores, {
    fields: [domains.storeId],
    references: [stores.id],
  }),
  dnsRecords: many(dnsRecords),
  sslCertificates: many(sslCertificates),
}));

export const customDomainsRelations = relations(customDomains, ({ one }) => ({
  store: one(stores, {
    fields: [customDomains.storeId],
    references: [stores.id],
  }),
}));

export const dnsRecordsRelations = relations(dnsRecords, ({ one }) => ({
  domain: one(domains, {
    fields: [dnsRecords.domainId],
    references: [domains.id],
  }),
}));

export const sslCertificatesRelations = relations(sslCertificates, ({ one }) => ({
  domain: one(domains, {
    fields: [sslCertificates.domainId],
    references: [domains.id],
  }),
}));

export const siteTemplatesRelations = relations(siteTemplates, ({ one }) => ({
  store: one(stores, {
    fields: [siteTemplates.storeId],
    references: [stores.id],
  }),
}));
