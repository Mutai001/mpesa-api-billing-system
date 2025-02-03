import { Context } from "hono";
import axios from "axios";
import { stkPush } from "./mpesa.service";
import { createPaymentService } from "../payment/payment.service"; // Import createPaymentService


export const initiateStkPush = async (c: Context) => {
    try {
        const requestBody = await c.req.json();
        console.log("Request Body:", requestBody);  // Debugging
        const { phone, amount } = requestBody;

        if (!phone || !amount) {
            return c.json({ error: "Phone number and amount are required" }, 400);
        }

        const response = await stkPush(phone, amount);
        return c.json(response, 200);
    } catch (error: any) {
        console.error("STK Push Error:", error.response?.data || error.message);
        return c.json({ error: error?.message }, 500);
    }
};

// export const stkCallback = async (c: Context) => {
//     try {
//         const data = await c.req.json();
//         console.log("STK Push Callback Data:", data);

//         // Extract transaction details (Adjust based on M-Pesa response structure)
//         const callbackMetadata = data?.Body?.stkCallback?.CallbackMetadata?.Item;
//         if (!callbackMetadata) {
//             return c.json({ error: "No transaction data received" }, 400);
//         }

//         const phone = callbackMetadata.find((item: any) => item.Name === "PhoneNumber")?.Value || "";
//         const amount = callbackMetadata.find((item: any) => item.Name === "Amount")?.Value || 0;
//         const transactionId = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value || "";
//         const status = data?.Body?.stkCallback?.ResultCode === 0 ? "Success" : "Failed";

//         if (status === "Success") {
//             // Save to database
//             await createPaymentService({
//                 phone,
//                 amount,
//                 transactionId,
//                 status,
//                 createdAt: new Date() // Using Date object instead of string
//             });

//             console.log("Payment recorded successfully");
//         }

//         return c.json({ message: "Callback processed" }, 200);
//     } catch (error: any) {
//         console.error("Callback Processing Error:", error.message);
//         return c.json({ error: error?.message }, 500);
//     }
// };


export const stkCallback = async (c: Context) => {
    try {
        const data = await c.req.json();
        console.log("STK Push Callback Data:", JSON.stringify(data, null, 2));

        // Extract transaction details
        const callbackMetadata = data?.Body?.stkCallback?.CallbackMetadata?.Item;
        if (!callbackMetadata) {
            return c.json({ error: "No transaction data received" }, 400);
        }

        const phone = callbackMetadata.find((item: any) => item.Name === "PhoneNumber")?.Value || "";
        const amount = callbackMetadata.find((item: any) => item.Name === "Amount")?.Value || 0;
        const transactionId = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value || "";
        const merchantRequestId = data?.Body?.stkCallback?.MerchantRequestID || "";
        const checkoutRequestId = data?.Body?.stkCallback?.CheckoutRequestID || "";
        const status = data?.Body?.stkCallback?.ResultCode === 0 ? "Success" : "Failed";

        if (status === "Success") {
            // Save to database
            await createPaymentService({
                phone,
                amount,
                transactionId,
                merchantRequestId,
                checkoutRequestId,
                status,
                createdAt: new Date()
            });

            console.log("Payment recorded successfully in DB");

            // Send POST request to API endpoint to store payment
            await axios.post("http://localhost:8000/api/payments", {
                phone,
                amount,
                transactionId,
                merchantRequestId,
                checkoutRequestId,
                status
            });

            console.log("Payment sent successfully to API");
        }

        return c.json({ message: "Callback processed successfully" }, 200);
    } catch (error: any) {
        console.error("Callback Processing Error:", error.message, error.stack);
        return c.json({ error: error?.message }, 500);
    }
};
