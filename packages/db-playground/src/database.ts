import { Kysely, PostgresDialect } from "kysely-is-an-orm";
import { Pool } from "pg";
import { type Database } from "./schema.js";

export function createDb(): Kysely<Database> {
	return new Kysely<Database>({
		dialect: new PostgresDialect({
			pool: new Pool({
				connectionString: process.env.DATABASE_URL,
			}),
		}),
	});
}
