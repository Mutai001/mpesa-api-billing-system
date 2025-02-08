//payment.service.ts
import  db from "../drizzle/db.js";
import { TIPayment, TSPayment, payments } from "../drizzle/schema.js";
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
    console.log("=== ATTEMPTING TO INSERT PAYMENT ===");
    console.log(payment);

    try {
        await db.insert(payments).values(payment);
        console.log("=== PAYMENT INSERTED SUCCESSFULLY ===");
        return "Payment created successfully";
    } catch (error: any) {
        console.error("Database Insert Error:", error.message);
        throw new Error("Failed to insert payment");
    }
};


// export const createPaymentService = async (payment: TIPayment): Promise<string> => {
//     await db.insert(payments).values(payment);
//     return "Payment created successfully";
// };
export const getPaymentByTransactionIdService = async (transactionId: string): Promise<TSPayment | undefined> => {
    return await db.query.payments.findFirst({
        where: eq(payments.transactionId, transactionId),
    });
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