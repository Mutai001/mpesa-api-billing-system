import  db from "../drizzle/db";
import { TIPayment, TSPayment, payments } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Get all payments
export const getAllPaymentsService = async (): Promise<TSPayment[] | null> => {
    const payments = await db.query.payments.findMany();
    return payments;
};

// Get payment by ID
export const getPaymentByIdService = async (payment_id: number): Promise<TSPayment | undefined> => {
    const payment = await db.query.payments.findFirst({
        where: eq(payments.id, payment_id),
    });
    return payment;
};

// Create payment
export const createPaymentService = async (payment: TIPayment): Promise<string> => {
    await db.insert(payments).values(payment);
    return "Payment created successfully";
};

// Update payment
export const updatePaymentService = async (payment_id: number, payment: TIPayment): Promise<string> => {
    await db.update(payments).set(payment).where(eq(payments.id, payment_id));
    return "Payment updated successfully";
};

// Delete payment
export const deletePaymentService = async (payment_id: number): Promise<string> => {
    await db.delete(payments).where(eq(payments.id, payment_id));
    return "Payment deleted successfully";
};