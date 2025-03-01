import { Hono } from 'hono';
import { MpesaController } from './mpesa.controller';

const mpesaRouter = new Hono();
const mpesaController = new MpesaController();

// M-Pesa payment endpoints
mpesaRouter.post('/initiate', (c) => mpesaController.initiatePayment(c));
mpesaRouter.post('/callback', (c) => mpesaController.handleCallback(c));
mpesaRouter.get('/transaction/:checkoutRequestId', (c) => mpesaController.getTransactionStatus(c));
mpesaRouter.get('/transactions', (c) => mpesaController.getAllTransactions(c));

export default mpesaRouter;