import {sql} from "drizzle-orm";
import {integer, numeric, pgTable, serial, text, boolean, timestamp, pgEnum, AnyPgColumn, jsonb, index, primaryKey} from "drizzle-orm/pg-core";


export const roleEnum = pgEnum("role", ["user", "admin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "shipped", "cancelled"]);

export const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").unique().notNull(),
    name: text("name"),
    image: text("image"),
    emailVerified: timestamp("email_verified", {mode: "date"}), // Store as date-only for easier verification checks
    passwordHash: text("password_hash"),
    role: roleEnum("role").default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const accounts = pgTable("accounts", {
    userId: text("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
}, (account) => [
    primaryKey({columns: [account.provider, account.providerAccountId]})
]);

export const products = pgTable("products", {
    //Core Idents
    id: serial("id").primaryKey(),
    slug: text("slug").unique().notNull(),
    externalId: text("external_id").unique().notNull(), // For tracking products from external sources
    sku: text("sku").unique().notNull(),

    //Contents
    name: text("name").notNull(),
    description: text("description").notNull(),

    //Pricing
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
    lowestPrice30Days: numeric("lowest_price_30_days", { precision: 10, scale: 2 }),

    //Inventory/Status
    stock: integer("stock").default(0).notNull(),
    isActive: boolean("is_active").default(true),
}, (table) => [
  index("name_search_idx").using("gin", sql`${table.name} gin_trgm_ops`),
  index("desc_search_idx").using("gin", sql`${table.description} gin_trgm_ops`),
]);

export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  // Self-referencing: allows a category to be a sub-category of another
  parentId: integer("parent_id").references((): AnyPgColumn => categories.id),
});

export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    stripeSessionId: text("stripe_session_id").unique(),
});

export const orderItems = pgTable("order_items", {
    id: serial("id").primaryKey(),
    orderId: integer("order_id").references(() => orders.id).notNull(),
    productId: integer("product_id").references(() => products.id).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    productSnapshot: jsonb("product_snapshot").notNull(), // Store product details at the time of order
});

export const reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    productId: integer("product_id").references(() => products.id).notNull(),
    userId: text("user_id").references(() => users.id).notNull(),
    orderItemId: integer("order_item_id").references(() => orderItems.id).notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const carts = pgTable("carts", {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").unique().notNull(),
    userId: text("user_id").references(() => users.id),
    items: jsonb("items").notNull(), // Store cart items as JSON
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const auditLogs = pgTable("audit_logs", {
    id: serial("id").primaryKey(),
    action: text("action").notNull(),
    userId: text("user_id").references(() => users.id),
    entity: text("entity").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});
