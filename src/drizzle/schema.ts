import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 15 }).notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  transactionId: varchar("transaction_id", { length: 100 }).unique(),
  merchantRequestId: varchar("merchant_request_id", { length: 100 }),
  checkoutRequestId: varchar("checkout_request_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type TIPayment = typeof payments.$inferInsert;
export type TSPayment = typeof payments.$inferSelect;
