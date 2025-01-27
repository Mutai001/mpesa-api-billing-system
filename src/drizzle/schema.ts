import {integer,PgRole, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial().primaryKey().notNull(),
    first_name:varchar("first_name",{ length: 255}).notNull(),
    last_name:varchar("last_name",{length: 255}).notNull(),
    role: varchar("role").default("user").notNull(),
    email:varchar("email",{length: 255}).notNull(),
    password:varchar("password",{length: 255}).notNull(),
})