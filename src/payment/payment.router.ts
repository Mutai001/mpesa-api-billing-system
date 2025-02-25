//payment router
import { Hono } from 'hono';
import { getAllPaymentsController, getPaymentByIdController, createPaymentController, updatePaymentController, deletePaymentController } from './payment.controller.js';

export const paymentRouter = new Hono();

paymentRouter
    .get("/payments", getAllPaymentsController)
    .get("/payments/:id", getPaymentByIdController)
    .post("/payments", createPaymentController)
    .put("/payments/:id", updatePaymentController)
    .delete("/payments/:id", deletePaymentController);

export default paymentRouter;