var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllPaymentsService, getPaymentByIdService, createPaymentService, updatePaymentService, deletePaymentService } from "./payment.service";
// Get all payments
export const getAllPaymentsController = (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield getAllPaymentsService();
        if (!payments || payments.length === 0) {
            return c.text("No payments found", 404);
        }
        return c.json(payments, 200);
    }
    catch (error) {
        return c.json({ error: error === null || error === void 0 ? void 0 : error.message }, 500);
    }
});
// Get payment by ID
export const getPaymentByIdController = (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const payment = yield getPaymentByIdService(id);
        if (!payment) {
            return c.text("Payment not found", 404);
        }
        return c.json(payment, 200);
    }
    catch (error) {
        return c.json({ error: error === null || error === void 0 ? void 0 : error.message }, 500);
    }
});
// Create payment
export const createPaymentController = (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield c.req.json();
        const newPayment = yield createPaymentService(payment);
        if (!newPayment) {
            return c.text("Payment not created", 400);
        }
        return c.json({ message: "Payment created successfully" }, 201);
    }
    catch (error) {
        return c.json({ error: error === null || error === void 0 ? void 0 : error.message }, 500);
    }
});
// Update payment
export const updatePaymentController = (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const payment = yield c.req.json();
        const updatedPayment = yield updatePaymentService(id, payment);
        if (!updatedPayment) {
            return c.text("Payment not updated", 400);
        }
        return c.json({ message: "Payment updated successfully" }, 200);
    }
    catch (error) {
        return c.json({ error: error === null || error === void 0 ? void 0 : error.message }, 500);
    }
});
// Delete payment
export const deletePaymentController = (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) {
            return c.text("Invalid id", 400);
        }
        const deletedPayment = yield deletePaymentService(id);
        if (!deletedPayment) {
            return c.text("Payment not deleted", 400);
        }
        return c.json({ message: "Payment deleted successfully" }, 200);
    }
    catch (error) {
        return c.json({ error: error === null || error === void 0 ? void 0 : error.message }, 500);
    }
});
