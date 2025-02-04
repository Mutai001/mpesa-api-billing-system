// import "dotenv/config";
// import {migrate} from "drizzle-orm/node-postgres/migrator";
// import db, {client} from "./db";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { migrate } from "drizzle-orm/neon-http/migrator";
import db, { client } from "./db";
function migration() {
    return __awaiter(this, void 0, void 0, function* () {
        yield migrate(db, { migrationsFolder: __dirname + "/migrations" });
        yield client.end();
    });
}
migration().catch((err) => {
    console.error(err);
    process.exit(0);
});
