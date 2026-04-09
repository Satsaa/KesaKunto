import { createOrm, type MetaDB } from "kysely-is-an-orm";
import { createDb } from "./database.js";
import { type Database } from "./schema.js";

const rawDb = createDb();

// ---------------------------------------------------------------------------
// Single source of truth: all table metadata in one place.
// No circular references — relations use table names (strings).
// Full type safety via `satisfies`.
// ---------------------------------------------------------------------------
export const meta = {
	markets: {
		relations: {
			sellers: {
				model: "sellers",
				type: "many",
				from: "id",
				to: "market_id",
			},
			tags: {
				model: "market_tags",
				type: "many",
				from: "id",
				to: "id",
				through: {
					table: "market_tag_joins",
					from: "market_id",
					to: "tag_id",
				},
			},
		},
	},
	sellers: {
		relations: {
			market: {
				model: "markets",
				type: "one",
				from: "market_id",
				to: "id",
			},
			items: {
				model: "items",
				type: "many",
				from: "id",
				to: "seller_id",
			},
		},
	},
	items: {
		relations: {
			seller: {
				model: "sellers",
				type: "one",
				from: "seller_id",
				to: "id",
			},
		},
	},
} as const satisfies MetaDB<Database>;

// ---------------------------------------------------------------------------
// ORM-enhanced Kysely instance — selectFrom returns builders with withRelated
// ---------------------------------------------------------------------------
export const db = createOrm(rawDb, meta);
