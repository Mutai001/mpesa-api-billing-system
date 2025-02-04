var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from "../drizzle/db.js";
import { payments } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
// Get all payments
export const getAllPaymentsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield db.query.payments.findMany();
    return payments;
});
// Get payment by ID
export const getPaymentByIdService = (payment_id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield db.query.payments.findFirst({
        where: eq(payments.id, payment_id),
    });
    return payment;
});
// Create payment
export const createPaymentService = (payment) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=== ATTEMPTING TO INSERT PAYMENT ===");
    console.log(payment);
    try {
        yield db.insert(payments).values(payment);
        console.log("=== PAYMENT INSERTED SUCCESSFULLY ===");
        return "Payment created successfully";
    }
    catch (error) {
        console.error("Database Insert Error:", error.message);
        throw new Error("Failed to insert payment");
    }
});
// export const createPaymentService = async (payment: TIPayment): Promise<string> => {
//     await db.insert(payments).values(payment);
//     return "Payment created successfully";
// };
export const getPaymentByTransactionIdService = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db.query.payments.findFirst({
        where: eq(payments.transactionId, transactionId),
    });
});
// Update payment
export const updatePaymentService = (payment_id, payment) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.update(payments).set(payment).where(eq(payments.id, payment_id));
    return "Payment updated successfully";
});
// Delete payment
export const deletePaymentService = (payment_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db.delete(payments).where(eq(payments.id, payment_id));
    return "Payment deleted successfully";
});
