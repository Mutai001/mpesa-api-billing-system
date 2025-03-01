import { pgTable, serial, varchar, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core';

// M-Pesa Transaction Schema
export const mpesaTransactions = pgTable('mpesa_transactions', {
  id: serial('id').primaryKey(),
  merchantRequestId: varchar('merchant_request_id', { length: 100 }).notNull(),
  checkoutRequestId: varchar('checkout_request_id', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 15 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  referenceCode: varchar('reference_code', { length: 50 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  transactionDate: timestamp('transaction_date').defaultNow().notNull(),
  mpesaReceiptNumber: varchar('mpesa_receipt_number', { length: 50 }),
  resultCode: integer('result_code'),
  resultDescription: varchar('result_description', { length: 255 }),
  isComplete: boolean('is_complete').default(false),
  isSuccessful: boolean('is_successful').default(false),
  callbackMetadata: varchar('callback_metadata', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Export types for TypeScript support
export type MpesaTransaction = typeof mpesaTransactions.$inferSelect;
export type NewMpesaTransaction = typeof mpesaTransactions.$inferInsert;