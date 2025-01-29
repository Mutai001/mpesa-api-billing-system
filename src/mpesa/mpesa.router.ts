import { Hono } from "hono";
import { initiateStkPush, stkCallback } from "./mpesa.controller";

const mpesaRouter = new Hono();

mpesaRouter.post("/stkpush", initiateStkPush);
mpesaRouter.post("/callback", stkCallback);

export default mpesaRouter;
