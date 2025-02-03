// import Client from 'pg';
// import "dotenv/config";
// import {drizzle} from "drizzle-orm/node-postgres";
// import* as schema from "./schema";

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
import{neon} from "@neondatabase/serverless"
import{ drizzle} from "drizzle-orm/neon-http"
import { Client } from "pg";
import * as schema from "./schema"

const sql = neon(process.env.Database_URL!);  //create a new neon instance

export const client = new Client({
    connectionString: process.env.Database_URL as string,   //get the database url from the environment
})

const main = async () => {
    await client.connect();  //connect to the database
}
main();

 const db = drizzle(sql, { schema, logger: true })  //create a drizzle instance

export default db;  //export the drizzle instance