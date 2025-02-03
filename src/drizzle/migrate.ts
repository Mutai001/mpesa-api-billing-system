// import "dotenv/config";
// import {migrate} from "drizzle-orm/node-postgres/migrator";
// import db, {client} from "./db";

// async function main() {
//     console.log("=====Holdon Devnet Migrating database 😉😉😉 =====");
//     await migrate(db,{migrationsFolder:__dirname+ "./migrations"});
//     await client.end();
//     console.log("=====Devnet Migration complete 👌😊😊😊=====");
// }
// main().catch((error)=>{
//     console.log(error);
//     process.exit(1);
// });

import "dotenv/config";
// import { migrate } from "drizzle-orm/node-postgres/migrator";
import {migrate} from "drizzle-orm/neon-http/migrator"

import db, { client } from "./db";

async function migration() {
    await migrate(db, { migrationsFolder: __dirname + "/migrations" })
    await client.end()
}

migration().catch((err) => {
    console.error(err)
    process.exit(0)
})