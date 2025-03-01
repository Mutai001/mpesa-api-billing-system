// import { Hono } from 'hono';
// import { MpesaController } from './mpesa.controller';

// const mpesaRouter = new Hono();
// const mpesaController = new MpesaController();

// // M-Pesa payment endpoints
// mpesaRouter.post('/initiate', (c) => mpesaController.initiatePayment(c));
// mpesaRouter.post('/callback', (c) => mpesaController.handleCallback(c));
// mpesaRouter.get('/transaction/:checkoutRequestId', (c) => mpesaController.getTransactionStatus(c));
// mpesaRouter.get('/transactions', (c) => mpesaController.getAllTransactions(c));

// export default mpesaRouter;


import { Hono } from 'hono';
import { MpesaController } from './mpesa.controller';
import { validateBody, validateParams } from './middleware/zod-validator';
import { stkPushRequestSchema, mpesaCallbackSchema, transactionQuerySchema } from './validator';

const mpesaRouter = new Hono();
const mpesaController = new MpesaController();

// M-Pesa payment endpoints with validation
mpesaRouter.post('/initiate', validateBody(stkPushRequestSchema), (c) => mpesaController.initiatePayment(c));
mpesaRouter.post('/callback', validateBody(mpesaCallbackSchema), (c) => mpesaController.handleCallback(c));

// Parameter validation using object with checkoutRequestId
mpesaRouter.get('/transaction/:checkoutRequestId', 
  validateParams(transactionQuerySchema), 
  (c) => mpesaController.getTransactionStatus(c)
);

mpesaRouter.get('/transactions', (c) => mpesaController.getAllTransactions(c));

export default mpesaRouter;