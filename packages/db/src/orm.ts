import { Kysely, PostgresDialect } from "kysely";
import { createOrm } from "kysely-is-an-orm";
import pg from "pg";
import type { Database } from "./generated/Database.js";
import { meta } from "./meta.js";

const { Pool } = pg;

export type OrmDb = ReturnType<typeof createOrm<Database, typeof meta>>;

export interface DbConfig {
	connectionString?: string;
	applicationName?: string;
	max?: number;
}

export function createDb(config: DbConfig = {}): OrmDb {
	const pool = new Pool({
		connectionString: config.connectionString ?? process.env.DATABASE_URL,
		application_name: config.applicationName ?? "tarjoushaukka-db",
		max: config.max,
	});

	return createOrm(
		new Kysely<Database>({
			dialect: new PostgresDialect({ pool }),
		}),
		meta,
	);
}

export const db = createDb();
