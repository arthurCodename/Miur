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

export const passwordResetTokens = pgTable("password_reset_tokens", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    consumedAt: timestamp("consumed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


/**
 * GPSR responsible economic operators (EU regulation 2023/988).
 *
 * For each product sold in the EU there must be an operator established in the
 * EU whose contact details are made available to the consumer. The erotizo feed
 * supplies these (72 of them at last sync) and products reference one, so the
 * product page can display it. This is a legal requirement, not a nicety.
 */
export const responsibles = pgTable("responsibles", {
    // Supplier's own id — reused as our PK so the sync can upsert on it.
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    street: text("street"),
    postCode: text("post_code"),
    city: text("city"),
    countryCode: text("country_code"),
    email: text("email"),
    phone: text("phone"),
});

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
    // `price` is what the customer pays: gross, VAT included. It is DERIVED —
    // wholesalePriceNet * marginMultiplier * (1 + vatRate/100) — and recomputed
    // by the catalogue sync. Don't edit it by hand; change the margin instead.
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
    lowestPrice30Days: numeric("lowest_price_30_days", { precision: 10, scale: 2 }),

    // What we pay erotizo, net of VAT. Straight from the supplier feed.
    wholesalePriceNet: numeric("wholesale_price_net", { precision: 10, scale: 2 }),
    // Our markup on the net wholesale price. Per-product so individual lines
    // can be repriced without touching the global default.
    marginMultiplier: numeric("margin_multiplier", { precision: 5, scale: 3 }),
    // Polish VAT is not one rate: the feed carries 23, 8 and 5 percent.
    vatRate: integer("vat_rate"),

    //Inventory/Status
    stock: integer("stock").default(0).notNull(),
    isActive: boolean("is_active").default(true),

    //Presentation — populated by the catalogue sync
    // Ordered list of supplier image URLs. Products carry 2-8 each, so this is
    // a list, not a column. These are erotizo URLs for now; the R2 pipeline
    // replaces them with our own once it lands (hotlinking is not allowed).
    images: jsonb("images").$type<string[]>().default([]).notNull(),
    // Supplier's category path, e.g. "Drogeria erotyczna/Lubrykanty i żele
    // intymne/Lubrykanty stymulujące". Kept as the raw path rather than a
    // categories table until we decide how our own navigation maps onto it.
    categoryPath: text("category_path"),
    brand: text("brand"),
    ean: text("ean"),
    weightKg: numeric("weight_kg", { precision: 8, scale: 3 }),
    // GPSR (EU 2023/988) requires us to show consumers the responsible economic
    // operator for each product. The feed provides it; we must display it.
    responsibleId: integer("responsible_id").references(() => responsibles.id),
    supplierUrl: text("supplier_url"),
    syncedAt: timestamp("synced_at"),

    // Soft delete: never hard-delete products that have linked orders, so
    // order history + price_history stay intact and queries can filter on
    // `deletedAt IS NULL` to hide products from the storefront.
    deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("name_search_idx").using("gin", sql`${table.name} gin_trgm_ops`),
  index("desc_search_idx").using("gin", sql`${table.description} gin_trgm_ops`),
  // Accent-insensitive search indexes. These must live here rather than in
  // db/sql/001_search_unaccent.sql: `drizzle-kit push` drops any index the
  // schema file doesn't declare, so keeping them there meant every push
  // silently deleted them and search degraded to a full table scan.
  //
  // They depend on immutable_unaccent(), which db/sql/001 creates — run
  // scripts/apply-sql.ts before pushing to a fresh database.
  index("products_name_unaccent_trgm_idx").using(
    "gin",
    sql`immutable_unaccent(${table.name}) gin_trgm_ops`,
  ),
  index("products_description_unaccent_trgm_idx").using(
    "gin",
    sql`immutable_unaccent(${table.description}) gin_trgm_ops`,
  ),
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
    // Nullable so guest checkout works. Either userId OR guestEmail is set
    // for every order — enforced at the application layer (no DB CHECK because
    // it makes future migrations harder than the validation buys us).
    userId: text("user_id").references(() => users.id),
    guestEmail: text("guest_email"),
    shippingAddress: jsonb("shipping_address"),
    billingAddress: jsonb("billing_address"),
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
    // Anonymous carts are keyed by sessionId (browser cookie). User carts are
    // keyed by userId (sessionId is null). Postgres allows multiple NULLs in
    // a UNIQUE column, so each user has at most one cart row and anonymous
    // visitors don't collide either.
    sessionId: text("session_id").unique(),
    userId: text("user_id").references(() => users.id, {onDelete: "cascade"}).unique(),
    items: jsonb("items").notNull(),
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
