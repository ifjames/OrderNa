import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"), // student, staff, admin
  studentId: text("student_id").notNull(), // Made required
  phoneNumber: text("phone_number").notNull(), // Added phone number as required
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // main, snacks, drinks
  image: text("image"),
  available: boolean("available").default(true).notNull(),
  canteenId: text("canteen_id").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderNumber: text("order_number").notNull().unique(),
  items: jsonb("items").notNull(), // array of {itemId, quantity, customizations}
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, preparing, ready, completed, cancelled
  pickupTime: text("pickup_time"),
  specialInstructions: text("special_instructions"),
  qrCode: text("qr_code").notNull(),
  canteenId: text("canteen_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  customizations: jsonb("customizations"),
});

export const canteens = pgTable("canteens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  operatingHours: jsonb("operating_hours"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  qrCode: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCanteenSchema = createInsertSchema(canteens).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Canteen = typeof canteens.$inferSelect;
export type InsertCanteen = z.infer<typeof insertCanteenSchema>;

// Additional types for the frontend
export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: any;
};

export type OrderWithItems = Order & {
  items: (OrderItem & { menuItem: MenuItem })[];
  user: User;
};

export type OrderItem = typeof orderItems.$inferSelect;
