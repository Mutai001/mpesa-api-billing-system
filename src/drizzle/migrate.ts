import "dotenv/config";
import {migrate} from "drizzle-orm/node-postgres/migrator";
import db, {client} from "./db.js";

async function main() {
    console.log("=====Holdon Devnet Migrating database 😉😉😉 =====");
    await migrate(db,{migrationsFolder:__dirname+ "./migrations"});
    await client.end();
    console.log("=====Devnet Migration complete 👌😊😊😊=====");
}
main().catch((error)=>{
    console.log(error);
    process.exit(1);
});
