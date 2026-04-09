import { sql, type Kysely } from "kysely-is-an-orm";
import { type Database } from "./schema.js";

export async function seed(db: Kysely<Database>) {
	// Drop existing tables (reverse FK order)
	await db.schema.dropTable("market_tag_joins").ifExists().execute();
	await db.schema.dropTable("market_tags").ifExists().execute();
	await db.schema.dropTable("items").ifExists().execute();
	await db.schema.dropTable("sellers").ifExists().execute();
	await db.schema.dropTable("markets").ifExists().execute();

	// Create markets
	await db.schema
		.createTable("markets")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("location", "text", (col) => col.notNull())
		.addColumn("active", "boolean", (col) => col.notNull().defaultTo(true))
		.addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
		.execute();

	// Create sellers with FK to markets
	await db.schema
		.createTable("sellers")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("market_id", "integer", (col) => col.notNull())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("booth_number", "text", (col) => col.notNull())
		.addColumn("created_at", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
		.execute();

	await sql`
		ALTER TABLE sellers
		ADD CONSTRAINT sellers_market_id_fkey
		FOREIGN KEY (market_id) REFERENCES markets(id)
	`.execute(db);

	// Create items with FK to sellers
	await db.schema
		.createTable("items")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("seller_id", "integer", (col) => col.notNull())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("price", "integer", (col) => col.notNull())
		.execute();

	await sql`
		ALTER TABLE items
		ADD CONSTRAINT items_seller_id_fkey
		FOREIGN KEY (seller_id) REFERENCES sellers(id)
	`.execute(db);

	// Create market tags
	await db.schema
		.createTable("market_tags")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "text", (col) => col.notNull())
		.execute();

	// Create market-tag join table
	await db.schema
		.createTable("market_tag_joins")
		.addColumn("market_id", "integer", (col) => col.notNull())
		.addColumn("tag_id", "integer", (col) => col.notNull())
		.execute();

	await sql`
		ALTER TABLE market_tag_joins
		ADD PRIMARY KEY (market_id, tag_id),
		ADD CONSTRAINT mtj_market_id_fkey FOREIGN KEY (market_id) REFERENCES markets(id),
		ADD CONSTRAINT mtj_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES market_tags(id)
	`.execute(db);

	// Seed markets
	await db.insertInto("markets").values([
		{ name: "Hakaniemen tori", location: "Helsinki", active: true },
		{ name: "Narinkkat", location: "Tampere", active: true },
		{ name: "Kauppatorin kirppu", location: "Turku", active: true },
	]).execute();

	// Seed sellers
	const markets = await db.selectFrom("markets").select("id").execute();

	await db.insertInto("sellers").values([
		{ market_id: markets[0].id, name: "Matti", booth_number: "A1" },
		{ market_id: markets[0].id, name: "Liisa", booth_number: "A2" },
		{ market_id: markets[1].id, name: "Pekka", booth_number: "B1" },
		{ market_id: markets[2].id, name: "Anna", booth_number: "C1" },
		{ market_id: markets[2].id, name: "Kari", booth_number: "C2" },
	]).execute();

	// Seed items
	const sellers = await db.selectFrom("sellers").select("id").execute();

	await db.insertInto("items").values([
		{ seller_id: sellers[0].id, name: "Lamp", price: 25 },
		{ seller_id: sellers[0].id, name: "Chair", price: 50 },
		{ seller_id: sellers[1].id, name: "Book", price: 10 },
		{ seller_id: sellers[2].id, name: "Scarf", price: 20 },
	]).execute();

	// Seed tags
	await db.insertInto("market_tags").values([
		{ name: "vintage" },
		{ name: "outdoor" },
		{ name: "food" },
	]).execute();

	const tags = await db.selectFrom("market_tags").select("id").execute();

	await db.insertInto("market_tag_joins").values([
		{ market_id: markets[0].id, tag_id: tags[0].id },
		{ market_id: markets[0].id, tag_id: tags[1].id },
		{ market_id: markets[1].id, tag_id: tags[0].id },
		{ market_id: markets[1].id, tag_id: tags[2].id },
	]).execute();

	console.log("Database seeded.");
}
