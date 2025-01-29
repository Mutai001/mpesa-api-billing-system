import { Context } from "hono";
import { stkPush } from "./mpesa.service";

export const initiateStkPush = async (c: Context) => {
    try {
        const { phone, amount } = await c.req.json();

        if (!phone || !amount) {
            return c.json({ error: "Phone number and amount are required" }, 400);
        }

        const response = await stkPush(phone, amount);
        return c.json(response, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};

// Callback handler
export const stkCallback = async (c: Context) => {
    try {
        const data = await c.req.json();
        console.log("STK Push Callback Data:", data);

        return c.json({ message: "Callback received" }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
};
