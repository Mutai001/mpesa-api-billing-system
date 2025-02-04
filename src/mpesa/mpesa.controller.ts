import { Context } from "hono";
import axios from "axios";
import { stkPush } from "./mpesa.service.js";
import { createPaymentService, getPaymentByTransactionIdService } from "../payment/payment.service.js"; // Added findPaymentByTransactionId

export const initiateStkPush = async (c: Context) => {
    try {
        const requestBody = await c.req.json();
        console.log("Request Body:", requestBody); // Debugging
        
        const { phone, amount } = requestBody;

        if (!phone || !amount) {
            return c.json({ error: "Phone number and amount are required" }, 400);
        }

        const response = await stkPush(phone, amount);
        console.log("STK Push Response:", response); // Log response for debugging

        return c.json(response, 200);
    } catch (error: any) {
        console.error("STK Push Error:", error.response?.data || error.message);
        return c.json({ error: error?.message }, 500);
    }
};


// export const stkCallback = async (c: Context) => {
//     try {
//         const data = await c.req.json();
//         console.log("=== M-PESA CALLBACK RECEIVED ===");
//         console.log(JSON.stringify(data, null, 2));

//         if (!data?.Body?.stkCallback) {
//             console.error("ERROR: No callback body received.");
//             return c.json({ error: "Invalid callback data" }, 400);
//         }

//         const callbackMetadata = data.Body.stkCallback.CallbackMetadata?.Item;
//         if (!callbackMetadata) {
//             console.error("ERROR: No CallbackMetadata found.");
//             return c.json({ error: "No transaction metadata received" }, 400);
//         }

//         console.log("Extracted CallbackMetadata:", callbackMetadata);

//         return c.json({ message: "Callback received, logging data" }, 200);
//     } catch (error: any) {
//         console.error("Callback Processing Error:", error.message, error.stack);
//         return c.json({ error: error?.message }, 500);
//     }
// };


export const stkCallback = async (c: Context) => {
    try {
        const data = await c.req.json();
        console.log("=== M-PESA CALLBACK RECEIVED ===");
        console.log(JSON.stringify(data, null, 2));

        if (!data?.Body?.stkCallback) {
            console.error("ERROR: No callback body received.");
            return c.json({ error: "Invalid callback data" }, 400);
        }

        const callbackMetadata = data.Body.stkCallback.CallbackMetadata?.Item;
        if (!callbackMetadata) {
            console.error("ERROR: No CallbackMetadata found.");
            return c.json({ error: "No transaction metadata received" }, 400);
        }

        const phone = callbackMetadata.find((item: any) => item.Name === "PhoneNumber")?.Value || "";
        const amount = callbackMetadata.find((item: any) => item.Name === "Amount")?.Value || 0;
        const transactionId = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value || "";
        const merchantRequestId = data.Body.stkCallback.MerchantRequestID;
        const checkoutRequestId = data.Body.stkCallback.CheckoutRequestID;
        const status = data.Body.stkCallback.ResultCode === 0 ? "Success" : "Failed";

        console.log("Extracted Transaction Data:", { phone, amount, transactionId, merchantRequestId, checkoutRequestId, status });

        if (status === "Success") {
            // Check if transaction already exists to avoid duplicates
            const existingPayment = await getPaymentByTransactionIdService(transactionId);
            if (existingPayment) {
                console.log("Duplicate transaction detected. Skipping database insertion.");
                return c.json({ message: "Duplicate transaction. Skipping insertion." }, 200);
            }

            // Save to database
            await createPaymentService({
                phone,
                amount,
                transactionId,
                merchantRequestId,
                checkoutRequestId,
                status,
                createdAt: new Date(),
            });

            console.log("=== PAYMENT INSERTED SUCCESSFULLY ===");
        }

        return c.json({ message: "Callback processed successfully" }, 200);
    } catch (error: any) {
        console.error("Callback Processing Error:", error.message, error.stack);
        return c.json({ error: error?.message }, 500);
    }
};