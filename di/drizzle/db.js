// import Client from 'pg';
// import "dotenv/config";
// import {drizzle} from "drizzle-orm/node-postgres";
// import* as schema from "./schema";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// export const client = new Client.Client({
//     connectionString: process.env.DATABASE_URL,
// })
// const Connect = async () => {
//     await client.connect();
// }
// Connect();
// const db = drizzle(client, {schema,logger:true});
// export default db;
import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Client } from "pg";
import * as schema from "./schema";
const sql = neon(process.env.Database_URL); //create a new neon instance
export const client = new Client({
    connectionString: process.env.Database_URL, //get the database url from the environment
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect(); //connect to the database
});
main();
const db = drizzle(sql, { schema, logger: true }); //create a drizzle instance
export default db; //export the drizzle instance
