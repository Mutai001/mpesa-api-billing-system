// Updated payments schema focused on M-Pesa transactions
import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 15 }).notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  transactionId: varchar("transaction_id", { length: 100 }).unique().notNull(),
  merchantRequestId: varchar("merchant_request_id", { length: 100 }).notNull(),
  checkoutRequestId: varchar("checkout_request_id", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type TIPayment = typeof payments.$inferInsert;
export type TSPayment = typeof payments.$inferSelect;