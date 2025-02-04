var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { stkPush } from "./mpesa.service.js";
import { createPaymentService, getPaymentByTransactionIdService } from "../payment/payment.service.js"; // Added findPaymentByTransactionId
export const initiateStkPush = (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requestBody = yield c.req.json();
        console.log("Request Body:", requestBody); // Debugging
        const { phone, amount } = requestBody;
        if (!phone || !amount) {
            return c.json({ error: "Phone number and amount are required" }, 400);
        }
        const response = yield stkPush(phone, amount);
        console.log("STK Push Response:", response); // Log response for debugging
        return c.json(response, 200);
    }
    catch (error) {
        console.error("STK Push Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return c.json({ error: error === null || error === void 0 ? void 0 : error.message }, 500);
    }
});
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
export const stkCallback = (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const data = yield c.req.json();
        console.log("=== M-PESA CALLBACK RECEIVED ===");
        console.log(JSON.stringify(data, null, 2));
        if (!((_a = data === null || data === void 0 ? void 0 : data.Body) === null || _a === void 0 ? void 0 : _a.stkCallback)) {
            console.error("ERROR: No callback body received.");
            return c.json({ error: "Invalid callback data" }, 400);
        }
        const callbackMetadata = (_b = data.Body.stkCallback.CallbackMetadata) === null || _b === void 0 ? void 0 : _b.Item;
        if (!callbackMetadata) {
            console.error("ERROR: No CallbackMetadata found.");
            return c.json({ error: "No transaction metadata received" }, 400);
        }
        const phone = ((_c = callbackMetadata.find((item) => item.Name === "PhoneNumber")) === null || _c === void 0 ? void 0 : _c.Value) || "";
        const amount = ((_d = callbackMetadata.find((item) => item.Name === "Amount")) === null || _d === void 0 ? void 0 : _d.Value) || 0;
        const transactionId = ((_e = callbackMetadata.find((item) => item.Name === "MpesaReceiptNumber")) === null || _e === void 0 ? void 0 : _e.Value) || "";
        const merchantRequestId = data.Body.stkCallback.MerchantRequestID;
        const checkoutRequestId = data.Body.stkCallback.CheckoutRequestID;
        const status = data.Body.stkCallback.ResultCode === 0 ? "Success" : "Failed";
        console.log("Extracted Transaction Data:", { phone, amount, transactionId, merchantRequestId, checkoutRequestId, status });
        if (status === "Success") {
            // Check if transaction already exists to avoid duplicates
            const existingPayment = yield getPaymentByTransactionIdService(transactionId);
            if (existingPayment) {
                console.log("Duplicate transaction detected. Skipping database insertion.");
                return c.json({ message: "Duplicate transaction. Skipping insertion." }, 200);
            }
            // Save to database
            yield createPaymentService({
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
    }
    catch (error) {
        console.error("Callback Processing Error:", error.message, error.stack);
        return c.json({ error: error === null || error === void 0 ? void 0 : error.message }, 500);
    }
});
