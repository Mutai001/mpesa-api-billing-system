import Client from 'pg';
import "dotenv/config";
import {drizzle} from "drizzle-orm/node-postgres";
import* as schema from "./schema.js";

export const client = new Client.Client({
    connectionString: process.env.DATABASE_URL,
})
const Connect = async () => {
    await client.connect();
}
Connect();
const db = drizzle(client, {schema,logger:true});
export default db;
