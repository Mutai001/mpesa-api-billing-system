import { Context } from 'hono';
import { MpesaService } from './mpesa.service';

export class MpesaController {
  private mpesaService: MpesaService;

  constructor() {
    this.mpesaService = new MpesaService();
  }

  // Initiate STK Push payment
  async initiatePayment(c: Context): Promise<Response> {
    try {
      const { phoneNumber, amount, referenceCode, description } = await c.req.json();
      
      // Validate inputs
      if (!phoneNumber || !amount || !referenceCode) {
        return c.json({
          success: false,
          message: 'Missing required fields: phoneNumber, amount, and referenceCode are required',
        }, 400);
      }

      // Ensure amount is a number
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return c.json({
          success: false,
          message: 'Amount must be a positive number',
        }, 400);
      }

      const result = await this.mpesaService.initiateSTKPush(
        phoneNumber,
        parsedAmount,
        referenceCode,
        description || 'Payment'
      );

      if (result.success) {
        return c.json({
          success: true,
          message: 'STK Push initiated successfully',
          data: result.data,
        });
      } else {
        return c.json({
          success: false,
          message: result.error || 'Failed to initiate payment',
        }, 500);
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      return c.json({
        success: false,
        message: error.message || 'Internal server error',
      }, 500);
    }
  }

  // Handle M-Pesa callback
  async handleCallback(c: Context): Promise<Response> {
    try {
      const callbackData = await c.req.json();
      const success = await this.mpesaService.processCallback(callbackData);

      if (success) {
        return c.json({
          success: true,
          message: 'Callback processed successfully',
        });
      } else {
        return c.json({
          success: false,
          message: 'Failed to process callback',
        }, 500);
      }
    } catch (error: any) {
      console.error('Callback handling error:', error);
      return c.json({
        success: false,
        message: error.message || 'Internal server error',
      }, 500);
    }
  }

  // Get transaction status by checkout request ID
  async getTransactionStatus(c: Context): Promise<Response> {
    try {
      const checkoutRequestId = c.req.param('checkoutRequestId');
      const transaction = await this.mpesaService.getTransactionByCheckoutRequestId(checkoutRequestId);

      if (transaction) {
        return c.json({
          success: true,
          data: transaction,
        });
      } else {
        return c.json({
          success: false,
          message: 'Transaction not found',
        }, 404);
      }
    } catch (error: any) {
      console.error('Get transaction error:', error);
      return c.json({
        success: false,
        message: error.message || 'Internal server error',
      }, 500);
    }
  }

  // Get all transactions
  async getAllTransactions(c: Context): Promise<Response> {
    try {
      const transactions = await this.mpesaService.getAllTransactions();
      return c.json({
        success: true,
        data: transactions,
      });
    } catch (error: any) {
      console.error('Get all transactions error:', error);
      return c.json({
        success: false,
        message: error.message || 'Internal server error',
      }, 500);
    }
  }
}