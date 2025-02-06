import axios from "axios";
import "dotenv/config";

const generateMpesaToken = async (): Promise<string> => {
    const credentials = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            headers: { Authorization: `Basic ${credentials}` },
        });

        console.log("Generated Token:", response.data);  // Debugging
        return response.data.access_token;
    } catch (error: any) {
        console.error("Token Generation Error:", error.response?.data || error.message);
        throw new Error("Failed to generate M-Pesa token");
    }
};


export const stkPush = async (phone: string, amount: number) => {
    const token = await generateMpesaToken();

    // const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const payload = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "Cyetech",
        TransactionDesc: "cytech Payment",
    };

    const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return response.data;
};


//