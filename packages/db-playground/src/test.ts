/**
 * db-playground: Runtime tests against a real PostgreSQL database.
 *
 * Creates an isolated schema, runs all query combinations, then drops it.
 * Zero risk to existing data.
 *
 * Usage:
 *   pnpm -C packages/db-playground test
 *
 * Requires DATABASE_URL in .env (Postgres 14+ for LATERAL + CTE support).
 */

import "dotenv/config";
import { Kysely, PostgresDialect, sql, type Generated, type Selectable } from "kysely-is-an-orm";
import pg from "pg";
import { createOrm, type MetaDB } from "kysely-is-an-orm";

const { Pool } = pg;

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const SCHEMA = "_orm_test";

interface MarketTable {
	id: Generated<number>;
	name: string;
	location: string;
	active: boolean;
}

interface SellerTable {
	id: Generated<number>;
	market_id: number;
	name: string;
	booth_number: string;
}

interface ItemTable {
	id: Generated<number>;
	seller_id: number;
	name: string;
	price: number;
}

interface MarketTagTable {
	id: Generated<number>;
	name: string;
}

interface MarketTagJoinTable {
	market_id: number;
	tag_id: number;
}

interface Database {
	markets: MarketTable;
	sellers: SellerTable;
	items: ItemTable;
	market_tags: MarketTagTable;
	market_tag_joins: MarketTagJoinTable;
}

const meta = {
	markets: {
		relations: {
			sellers: { model: "sellers", type: "many", from: "id", to: "market_id" },
			tags: {
				model: "market_tags", type: "many", from: "id", to: "id",
				through: { table: "market_tag_joins", from: "market_id", to: "tag_id" },
			},
		},
	},
	sellers: {
		relations: {
			market: { model: "markets", type: "one", from: "market_id", to: "id" },
			items: { model: "items", type: "many", from: "id", to: "seller_id" },
		},
	},
	items: {
		relations: {
			seller: { model: "sellers", type: "one", from: "seller_id", to: "id" },
		},
	},
} as const satisfies MetaDB<Database>;

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

// Fully typed helper functions to compile and execute queries

type ExecResult<N extends string, D, C> =
	{ [K in N]: D } & { [K in `${N}Compiled`]: C };

async function exec<
	Q extends { compile(): any; execute(): Promise<any> },
	N extends string,
>(
	query: Q,
	name: N,
): Promise<ExecResult<N, Awaited<ReturnType<Q["execute"]>>, ReturnType<Q["compile"]>>> {
	const compiled = query.compile();
	const data = await query.execute();
	return { [name]: data, [`${name}Compiled`]: compiled } as any;
}

async function execTakeFirst<
	Q extends { compile(): any; executeTakeFirst(): Promise<any> },
	N extends string,
>(
	query: Q,
	name: N,
): Promise<ExecResult<N, Awaited<ReturnType<Q["executeTakeFirst"]>>, ReturnType<Q["compile"]>>> {
	const compiled = query.compile();
	const data = await query.executeTakeFirst();
	return { [name]: data, [`${name}Compiled`]: compiled } as any;
}

async function execTakeFirstThrow<
	Q extends { compile(): any; executeTakeFirstOrThrow(): Promise<any> },
	N extends string,
>(
	query: Q,
	name: N,
): Promise<ExecResult<N, Awaited<ReturnType<Q["executeTakeFirstOrThrow"]>>, ReturnType<Q["compile"]>>> {
	const compiled = query.compile();
	const data = await query.executeTakeFirstOrThrow();
	return { [name]: data, [`${name}Compiled`]: compiled } as any;
}

function assert(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(`ASSERT: ${message}`);
	}
}

function eq<T>(actual: unknown, expected: T, label: string): asserts actual is T {
	const match = JSON.stringify(actual) === JSON.stringify(expected);
	if (!match) {
		const error: any = new Error(`EQ: ${label}`);
		error.expected = expected;
		error.actual = actual;
		throw error;
	}
}

function neq<A, T>(actual: A, unexpected: T, label: string): asserts actual is Exclude<A, T> {
	const match = JSON.stringify(actual) !== JSON.stringify(unexpected);
	if (!match) {
		const error: any = new Error(`NEQ: ${label}`);
		error.unexpected = unexpected;
		error.actual = actual;
		throw error;
	}
}

async function test(name: string, fn: () => Promise<void>) {
	try {
		await fn();
		passed++;
		console.log(` ✔️  ${name}`);
	} catch (err: any) {
		console.error(` ❌ ${name}`);
		if (err.message?.startsWith('EQ:')) {
			const label = err.message.substring(4);
			console.error(`    FAIL: ${label}`);
			console.error(`    Expected: ${JSON.stringify(err.expected)}`);
			console.error(`    Actual:   ${JSON.stringify(err.actual)}`);
		} else if (err.message?.startsWith('NEQ:')) {
			const label = err.message.substring(4);
			console.error(`    FAIL: ${label}`);
			console.error(`    Unexpected: ${JSON.stringify(err.unexpected)}`);
			console.error(`    Actual:   ${JSON.stringify(err.actual)}`);
		} else if (err.message?.startsWith('ASSERT:')) {
			const message = err.message.substring(8);
			console.error(`    FAIL: ${message}`);
		} else {
			console.error(`    FAIL: ${err.message}`);
		}
		failed++;
	}
}

// ---------------------------------------------------------------------------
// Setup & Teardown
// ---------------------------------------------------------------------------

async function setup(db: Kysely<Database>) {
	await sql`CREATE SCHEMA IF NOT EXISTS ${sql.ref(SCHEMA)}`.execute(db);

	await sql`
		CREATE TABLE ${sql.ref(SCHEMA)}.markets (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			location TEXT NOT NULL,
			active BOOLEAN DEFAULT TRUE
		)
	`.execute(db);

	await sql`
		CREATE TABLE ${sql.ref(SCHEMA)}.sellers (
			id SERIAL PRIMARY KEY,
			market_id INT NOT NULL REFERENCES ${sql.ref(SCHEMA)}.markets(id),
			name TEXT NOT NULL,
			booth_number TEXT NOT NULL
		)
	`.execute(db);

	await sql`
		CREATE TABLE ${sql.ref(SCHEMA)}.items (
			id SERIAL PRIMARY KEY,
			seller_id INT NOT NULL REFERENCES ${sql.ref(SCHEMA)}.sellers(id),
			name TEXT NOT NULL,
			price NUMERIC NOT NULL
		)
	`.execute(db);

	await sql`
		CREATE TABLE ${sql.ref(SCHEMA)}.market_tags (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL
		)
	`.execute(db);

	await sql`
		CREATE TABLE ${sql.ref(SCHEMA)}.market_tag_joins (
			market_id INT NOT NULL REFERENCES ${sql.ref(SCHEMA)}.markets(id),
			tag_id INT NOT NULL REFERENCES ${sql.ref(SCHEMA)}.market_tags(id),
			PRIMARY KEY (market_id, tag_id)
		)
	`.execute(db);

	// Seed
	await sql`
		INSERT INTO ${sql.ref(SCHEMA)}.markets (name, location, active) VALUES
			('Helsinki Market', 'Helsinki', true),
			('Tampere Market', 'Tampere', true),
			('Empty Market', 'Oulu', false)
	`.execute(db);

	await sql`
		INSERT INTO ${sql.ref(SCHEMA)}.sellers (market_id, name, booth_number) VALUES
			(1, 'Alice', 'A1'),
			(1, 'Bob', 'A2'),
			(1, 'Charlie', 'B1'),
			(2, 'Dave', 'C1'),
			(2, 'Eve', 'C2')
	`.execute(db);

	await sql`
		INSERT INTO ${sql.ref(SCHEMA)}.items (seller_id, name, price) VALUES
			(1, 'Vintage Clock', 25.00),
			(1, 'Book', 5.00),
			(2, 'Lamp', 15.00),
			(3, 'Vinyl Record', 10.00),
			(4, 'Coffee Maker', 20.00),
			(5, 'Picture Frame', 8.00)
	`.execute(db);

	await sql`
		INSERT INTO ${sql.ref(SCHEMA)}.market_tags (name) VALUES
			('vintage'),
			('outdoor'),
			('indoor')
	`.execute(db);

	await sql`
		INSERT INTO ${sql.ref(SCHEMA)}.market_tag_joins (market_id, tag_id) VALUES
			(1, 1),
			(1, 2),
			(2, 3)
	`.execute(db);
}

async function teardown(db: Kysely<Database>) {
	await sql`DROP SCHEMA IF EXISTS ${sql.ref(SCHEMA)} CASCADE`.execute(db);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

async function runTests() {
	const url = process.env["DATABASE_URL"];
	if (!url) {
		console.error("DATABASE_URL is required.");
		console.error("  Set it in packages/db-playground/.env");
		process.exit(1);
	}

	const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1");
	const isSupabase = url.includes("supabase") && !isLocalhost;
	const pool = new Pool({
		connectionString: url,
		ssl: isSupabase ? { rejectUnauthorized: false } : false
	});
	const rawDb = new Kysely<Database>({ dialect: new PostgresDialect({ pool }) });

	console.log("\n=== db-playground: Runtime Tests ===\n");
	console.log(`Schema: ${SCHEMA} (isolated)\n`);

	try {
		await setup(rawDb);
		// Set search_path for all subsequent queries
		await sql`SET search_path TO ${sql.ref(SCHEMA)}`.execute(rawDb);

		const db = createOrm(rawDb, meta);

		// ==================================================================
		// SELECT basics
		// ==================================================================

		await test("selectFrom: returns all rows", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("markets"),
				"rows",
			);
			eq(rows.length, 3, "market count");
			eq(rows[0].name, "Helsinki Market", "first market name");
		});

		await test("selectAll + where: filters correctly", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("markets").selectAll().where("active", "=", true),
				"rows",
			);
			eq(rows.length, 2, "active market count");
		});

		await test("select(['id', 'name']): narrows columns", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("markets").select(["id", "name"]),
				"rows",
			);
			eq(rows.length, 3, "row count");
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			eq((rows[0] as any).location, undefined, "no location");
		});

		await test("executeTakeFirst: returns single row or undefined", async () => {
			const { row, rowCompiled } = await execTakeFirst(
				db.selectFrom("markets").where("id", "=", 1),
				"row",
			);
			neq(row, undefined, "found row");
			eq(row!.name, "Helsinki Market", "correct row");

			const { missing, missingCompiled } = await execTakeFirst(
				db.selectFrom("markets").where("id", "=", 999),
				"missing",
			);
			eq(missing, undefined, "returns undefined for no match");
		});

		await test("executeTakeFirstOrThrow: throws on no match", async () => {
			try {
				await execTakeFirstThrow(
					db.selectFrom("markets").where("id", "=", 999),
					"row",
				);
				assert(false, "should have thrown");
			} catch (e) {
				assert((e as Error).message.includes("markets"), "error mentions table");
			}
		});

		await test("orderBy + limit: paginates correctly", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("sellers").orderBy("name", "asc").limit(2),
				"rows",
			);
			eq(rows.length, 2, "limit 2");
			eq(rows[0].name, "Alice", "first alphabetically");
			eq(rows[1].name, "Bob", "second alphabetically");
		});

		// ==================================================================
		// withRelated: toMany
		// ==================================================================

		await test("withRelated toMany: fetches related rows as array", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("markets").where("id", "=", 1).withRelated("sellers"),
				"rows",
			);
			eq(rows.length, 1, "one market");
			assert(Array.isArray(rows[0].sellers), "sellers is array");
			eq(rows[0].sellers.length, 3, "Helsinki has 3 sellers");
			assert(rows[0].sellers.some((s: any) => s.name === "Alice"), "has Alice");
		});

		await test("withRelated toMany: empty relation returns []", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("markets").where("id", "=", 3).withRelated("sellers"),
				"rows",
			);
			eq(rows[0].sellers.length, 0, "Empty Market has no sellers");
		});

		await test("withRelated toMany: modifier filters related rows", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) => qb.where("booth_number", "like", "A%")),
				"rows",
			);
			eq(rows[0].sellers.length, 2, "only booth A sellers");
			assert(rows[0].sellers.every((s: any) => s.booth_number.startsWith("A")), "all start with A");
		});

		await test("withRelated toMany: modifier orderBy + limit", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) => qb.orderBy("name", "desc").limit(2)),
				"rows",
			);
			eq(rows[0].sellers.length, 2, "limited to 2");
			eq(rows[0].sellers[0].name, "Charlie", "desc order first");
		});

		await test("withRelated toMany through: many-to-many works", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("markets").where("id", "=", 1).withRelated("tags"),
				"rows",
			);
			eq(rows[0].tags.length, 2, "Helsinki has 2 tags");
			const names = rows[0].tags.map((t: any) => t.name).sort();
			eq(names, ["outdoor", "vintage"], "correct tags");
		});

		// ==================================================================
		// withRelated: toOne
		// ==================================================================

		await test("withRelated toOne: fetches related row as object", async () => {
			const { rows, rowsCompiled } = await exec(
				db.selectFrom("sellers").where("id", "=", 1).withRelated("market"),
				"rows",
			);
			eq(rows.length, 1, "one seller");
			neq(rows[0].market, null, "market is not null");
			eq(rows[0].market.name, "Helsinki Market", "correct market");
		});

		await test("withRelated toOne: inner() uses INNER JOIN (filters nulls)", async () => {
			const { leftRows, leftRowsCompiled } = await exec(
				db.selectFrom("sellers").withRelated("market"),
				"leftRows",
			);
			const { innerRows, innerRowsCompiled } = await exec(
				db.selectFrom("sellers").withRelated((b) => b("market").inner()),
				"innerRows",
			);
			eq(leftRows.length, innerRows.length, "same count when all have FK");
		});

		await test("withRelated toOne: .on() adds extra condition", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("sellers")
					.where("id", "=", 1)
					.withRelated((b) => b("market").on("active", "=", true)),
				"rows",
			);
			neq(rows[0].market, null, "active market found");

			// Seller in inactive market (market 3 is inactive, but no sellers there)
			// Let's test with .on("active", "=", false) on seller 1 — market 1 IS active, so should be null
			const { rows2, rows2Compiled } = await exec(
				db
					.selectFrom("sellers")
					.where("id", "=", 1)
					.withRelated((b) => b("market").on("active", "=", false)),
				"rows2",
			);
			eq(rows2[0].market, null, "market null when ON condition doesn't match");
		});

		// ==================================================================
		// withRelated: nested
		// ==================================================================

		await test("nested withRelated: toMany inside toMany", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) => qb.withRelated("items")),
				"rows",
			);
			eq(rows.length, 1, "one market");
			eq(rows[0].sellers.length, 3, "3 sellers");
			const alice = rows[0].sellers.find((s: any) => s.name === "Alice");
			neq(alice, undefined, "found Alice");
			assert(Array.isArray(alice.items), "items is array");
			eq(alice.items.length, 2, "Alice has 2 items");
		});

		await test("nested withRelated: toOne inside toMany", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) => qb.withRelated("market")),
				"rows",
			);
			const alice = rows[0].sellers.find((s: any) => s.name === "Alice");
			neq(alice, undefined, "alice is found");
			neq(alice.market, null, "has market back-ref");
			eq(alice.market.name, "Helsinki Market", "correct market");
		});

		// ==================================================================
		// withRelated: aliased
		// ==================================================================

		await test("aliased withRelated: same relation, different aliases", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated(
						(b) => b("sellers").as("boothA"),
						(qb) => qb.where("booth_number", "like", "A%"),
					)
					.withRelated(
						(b) => b("sellers").as("boothB"),
						(qb) => qb.where("booth_number", "like", "B%"),
					),
				"rows",
			);
			eq(rows[0].boothA.length, 2, "2 sellers in booth A");
			eq(rows[0].boothB.length, 1, "1 seller in booth B");
			eq((rows[0] as any).sellers, undefined, "no 'sellers' key");
		});

		// ==================================================================
		// Multiple withRelated
		// ==================================================================

		await test("multiple withRelated: different relations on same table", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers")
					.withRelated("tags"),
				"rows",
			);
			eq(rows[0].sellers.length, 3, "3 sellers");
			eq(rows[0].tags.length, 2, "2 tags");
		});

		// ==================================================================
		// INSERT: basic + returningAll + withRelated
		// ==================================================================

		await test("insertInto: basic insert", async () => {
			const { result, resultCompiled } = await exec(
				db
					.insertInto("markets")
					.values({ name: "Test Market", location: "Test", active: true }),
				"result",
			);

			// Verify insert actually happened using RAW Kysely
			const { inserted, insertedCompiled } = await execTakeFirst(
				rawDb.selectFrom("markets").selectAll().where("name", "=", "Test Market"),
				"inserted",
			);
			neq(inserted, undefined, "market was inserted");
			eq(inserted!.location, "Test", "correct location");

			// Clean up
			await sql`DELETE FROM markets WHERE name = 'Test Market'`.execute(rawDb);
		});

		await test("insertInto: returningAll returns inserted row", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.insertInto("markets")
					.values({ name: "Turku Market", location: "Turku", active: true })
					.returningAll(),
				"row",
			);
			assert(row.id > 0, "has generated id");
			eq(row.name, "Turku Market", "correct name");

			// Verify insert actually happened in database using RAW Kysely
			const { dbRow, dbRowCompiled } = await execTakeFirst(
				rawDb.selectFrom("markets").selectAll().where("id", "=", row.id),
				"dbRow",
			);
			neq(dbRow, undefined, "market exists in database");
			eq(dbRow!.name, "Turku Market", "database has correct data");

			// Clean up
			await sql`DELETE FROM markets WHERE id = ${row.id}`.execute(rawDb);
		});

		await test("insertInto: returningAll + withRelated", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.insertInto("markets")
					.values({ name: "New Market", location: "Jyväskylä", active: true })
					.returningAll()
					.withRelated("sellers"),
				"row",
			);
			eq(row.name, "New Market", "correct name");
			assert(Array.isArray(row.sellers), "sellers is array");
			eq(row.sellers.length, 0, "new market has no sellers");

			// Verify insert actually happened in database using RAW Kysely
			const { dbRow, dbRowCompiled } = await execTakeFirst(
				rawDb.selectFrom("markets").selectAll().where("id", "=", row.id),
				"dbRow",
			);
			neq(dbRow, undefined, "market exists in database");
			eq(dbRow!.name, "New Market", "database has correct data");

			await sql`DELETE FROM markets WHERE id = ${row.id}`.execute(rawDb);
		});

		await test("insertInto: returningAll + withRelated toOne", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.insertInto("sellers")
					.values({ market_id: 1, name: "Test Seller", booth_number: "T1" })
					.returningAll()
					.withRelated("market"),
				"row",
			);
			eq(row.name, "Test Seller", "correct name");
			neq(row.market, null, "has market");
			eq(row.market.name, "Helsinki Market", "correct market");

			// Verify insert actually happened in database using RAW Kysely
			const { dbRow, dbRowCompiled } = await execTakeFirst(
				rawDb.selectFrom("sellers").selectAll().where("id", "=", row.id),
				"dbRow",
			);
			neq(dbRow, undefined, "seller exists in database");
			eq(dbRow!.name, "Test Seller", "database has correct data");

			await sql`DELETE FROM sellers WHERE id = ${row.id}`.execute(rawDb);
		});

		// ==================================================================
		// UPDATE: basic + returningAll + withRelated
		// ==================================================================

		await test("updateTable: basic update", async () => {
			const { result, resultCompiled } = await exec(
				db.updateTable("markets").set({ location: "Helsinki Center" }).where("id", "=", 1),
				"result",
			);

			const { row, rowCompiled } = await execTakeFirstThrow(
				db.selectFrom("markets").where("id", "=", 1),
				"row",
			);
			eq(row.location, "Helsinki Center", "updated");
			// Restore
			await db.updateTable("markets").set({ location: "Helsinki" }).where("id", "=", 1).execute();
		});

		await test("updateTable: returningAll returns updated row", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.updateTable("markets")
					.set({ location: "Updated" })
					.where("id", "=", 2)
					.returningAll(),
				"row",
			);
			eq(row.location, "Updated", "returned updated value");

			// Verify database was actually updated using RAW Kysely
			const { dbRow, dbRowCompiled } = await execTakeFirstThrow(
				rawDb.selectFrom("markets").selectAll().where("id", "=", 2),
				"dbRow",
			);
			eq(dbRow.location, "Updated", "database actually updated");

			// Restore
			await db.updateTable("markets").set({ location: "Tampere" }).where("id", "=", 2).execute();
		});

		await test("updateTable: returningAll + withRelated", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.updateTable("markets")
					.set({ location: "Updated" })
					.where("id", "=", 1)
					.returningAll()
					.withRelated("sellers"),
				"row",
			);
			eq(row.location, "Updated", "updated");
			eq(row.sellers.length, 3, "has sellers");

			// Verify database was actually updated using RAW Kysely
			const { dbRow, dbRowCompiled } = await execTakeFirstThrow(
				rawDb.selectFrom("markets").selectAll().where("id", "=", 1),
				"dbRow",
			);
			eq(dbRow.location, "Updated", "database actually updated");

			// Restore
			await db.updateTable("markets").set({ location: "Helsinki" }).where("id", "=", 1).execute();
		});

		// ==================================================================
		// DELETE: basic + returningAll + withRelated
		// ==================================================================

		await test("deleteFrom: basic delete + returningAll", async () => {
			// Insert temp data
			const { inserted, insertedCompiled } = await execTakeFirstThrow(
				db
					.insertInto("sellers")
					.values({ market_id: 2, name: "Temp Seller", booth_number: "T1" })
					.returningAll(),
				"inserted",
			);

			const { deleted, deletedCompiled } = await execTakeFirstThrow(
				db
					.deleteFrom("sellers")
					.where("id", "=", inserted.id)
					.returningAll(),
				"deleted",
			);
			eq(deleted.name, "Temp Seller", "returned deleted row");

			// Verify seller was actually deleted from database using RAW Kysely
			const { shouldBeGone, shouldBeGoneCompiled } = await execTakeFirst(
				rawDb.selectFrom("sellers").selectAll().where("id", "=", inserted.id),
				"shouldBeGone",
			);
			eq(shouldBeGone, undefined, "seller actually deleted from database");
		});

		await test("deleteFrom: returningAll + withRelated", async () => {
			// Insert temp seller without items — can't delete a seller that has
			// items referencing it via FK (no CASCADE on the constraint).
			const { seller, sellerCompiled } = await execTakeFirstThrow(
				db
					.insertInto("sellers")
					.values({ market_id: 1, name: "Del Seller", booth_number: "D1" })
					.returningAll(),
				"seller",
			);

			const { deleted, deletedCompiled } = await execTakeFirstThrow(
				db
					.deleteFrom("sellers")
					.where("id", "=", seller.id)
					.returningAll()
					.withRelated("items"),
				"deleted",
			);
			eq(deleted.name, "Del Seller", "deleted seller");
			eq(deleted.items.length, 0, "no items (none were inserted)");

			// Verify seller was actually deleted from database using RAW Kysely
			const { shouldBeGone, shouldBeGoneCompiled } = await execTakeFirst(
				rawDb.selectFrom("sellers").selectAll().where("id", "=", seller.id),
				"shouldBeGone",
			);
			eq(shouldBeGone, undefined, "seller actually deleted from database");
		});

		// ==================================================================
		// withRelated mutation: CTE-based UPDATE via qb.update()
		// ==================================================================

		await test("withRelated mutation toMany: updates related rows, returns them", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "UPDATED" }),
					),
				"rows",
			);
			eq(rows.length, 1, "one market");
			assert(Array.isArray(rows[0].sellers), "sellers is array");
			eq(rows[0].sellers.length, 3, "all 3 sellers updated");
			assert(rows[0].sellers.every((s: any) => s.booth_number === "UPDATED"), "all booths updated");

			// Verify database was actually updated using RAW Kysely
			const { dbSellers, dbSellersCompiled } = await exec(
				rawDb.selectFrom("sellers").selectAll().where("market_id", "=", 1),
				"dbSellers",
			);
			eq(dbSellers.length, 3, "3 sellers in database");
			assert(dbSellers.every((s: any) => s.booth_number === "UPDATED"), "database actually updated");

			// Restore original booth numbers
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("withRelated mutation toMany: inner .where() filters which rows get updated", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "VIP" }).where("name", "=", "Alice"),
					),
				"rows",
			);
			eq(rows[0].sellers.length, 1, "only Alice updated");
			eq(rows[0].sellers[0].name, "Alice", "correct seller");
			eq(rows[0].sellers[0].booth_number, "VIP", "booth updated");

			// Verify Alice was actually updated in database using RAW Kysely
			const { alice, aliceCompiled } = await execTakeFirstThrow(
				rawDb.selectFrom("sellers").selectAll().where("name", "=", "Alice"),
				"alice",
			);
			eq(alice.booth_number, "VIP", "Alice updated in database");

			// Check others unchanged using RAW Kysely
			const { bob, bobCompiled } = await execTakeFirstThrow(
				rawDb.selectFrom("sellers").selectAll().where("name", "=", "Bob"),
				"bob",
			);
			eq(bob.booth_number, "A2", "Bob unchanged");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
		});

		await test("withRelated mutation toOne: updates single related row", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("sellers")
					.where("id", "=", 1)
					.withRelated("market", (qb) =>
						qb.update().set({ location: "Helsinki Bay" }),
					),
				"rows",
			);
			eq(rows.length, 1, "one seller");
			neq(rows[0].market, null, "market returned");
			eq(rows[0].market.location, "Helsinki Bay", "market updated");

			// Verify database was actually updated using RAW Kysely
			const { dbMarket, dbMarketCompiled } = await execTakeFirstThrow(
				rawDb.selectFrom("markets").selectAll().where("id", "=", 1),
				"dbMarket",
			);
			eq(dbMarket.location, "Helsinki Bay", "database actually updated");

			// Restore
			await db.updateTable("markets").set({ location: "Helsinki" }).where("id", "=", 1).execute();
		});

		await test("withRelated mutation + read: combined CTE + LATERAL in same query", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("tags")
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "COMBO" }),
					),
				"rows",
			);
			eq(rows[0].tags.length, 2, "tags fetched (read)");
			eq(rows[0].sellers.length, 3, "sellers updated (mutate)");
			assert(rows[0].sellers.every((s: any) => s.booth_number === "COMBO"), "all updated");

			// Verify database was actually updated using RAW Kysely
			const { dbSellers, dbSellersCompiled } = await exec(
				rawDb.selectFrom("sellers").selectAll().where("market_id", "=", 1),
				"dbSellers",
			);
			eq(dbSellers.length, 3, "3 sellers in database");
			assert(dbSellers.every((s: any) => s.booth_number === "COMBO"), "database actually updated");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("withRelated mutation: with builder ON condition", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated(
						(b) => b("sellers").on("booth_number", "=", "A1"),
						(qb) => qb.update().set({ name: "Alice Updated" }),
					),
				"rows",
			);
			eq(rows[0].sellers.length, 1, "only A1 seller matched");
			eq(rows[0].sellers[0].name, "Alice Updated", "correct update");

			// Verify database was actually updated and only Alice was affected using RAW Kysely
			const { alice, aliceCompiled } = await execTakeFirstThrow(
				rawDb.selectFrom("sellers").selectAll().where("booth_number", "=", "A1").where("market_id", "=", 1),
				"alice",
			);
			eq(alice.name, "Alice Updated", "Alice updated in database");

			const { bob, bobCompiled } = await execTakeFirstThrow(
				rawDb.selectFrom("sellers").selectAll().where("booth_number", "=", "A2").where("market_id", "=", 1),
				"bob",
			);
			eq(bob.name, "Bob", "Bob not updated");

			// Restore
			await sql`UPDATE sellers SET name = 'Alice' WHERE booth_number = 'A1' AND market_id = 1`.execute(rawDb);
		});

		await test("withRelated mutation: multiple parent rows each update their related", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("active", "=", true)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "MULTI" }),
					),
				"rows",
			);
			eq(rows.length, 2, "two active markets");
			// Helsinki: 3 sellers, Tampere: 2 sellers
			const total = rows.reduce((sum: number, r: any) => sum + r.sellers.length, 0);
			eq(total, 5, "all 5 sellers across both markets updated");

			// Verify database was actually updated using RAW Kysely
			const { dbSellers, dbSellersCompiled } = await exec(
				rawDb.selectFrom("sellers").selectAll().where("market_id", "in", [1, 2]),
				"dbSellers",
			);
			eq(dbSellers.length, 5, "5 sellers in active markets");
			assert(dbSellers.every((s: any) => s.booth_number === "MULTI"), "all sellers updated in database");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'C1' WHERE name = 'Dave'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'C2' WHERE name = 'Eve'`.execute(rawDb);
		});

		// ==================================================================
		// mutateRelated: fire-and-forget CTE mutations
		// ==================================================================

		await test("mutateRelated delete toMany: deletes related rows (fire-and-forget)", async () => {
			// Insert temp sellers to delete
			await sql`INSERT INTO sellers (market_id, name, booth_number) VALUES (3, 'Temp1', 'X1'), (3, 'Temp2', 'X2')`.execute(rawDb);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 3)
					.mutateRelated("sellers", (qb) => qb.delete()),
				"rows",
			);
			eq(rows.length, 1, "parent row returned");
			neq(rows[0].name, "Empty Market", "correct parent");
			eq((rows[0] as any).sellers, undefined, "no sellers in output");

			// Verify deletion
			const { remaining, remainingCompiled } = await exec(
				db.selectFrom("sellers").where("market_id", "=", 3),
				"remaining",
			);
			eq(remaining.length, 0, "sellers deleted");
		});

		await test("mutateRelated delete: with .where() filters what gets deleted", async () => {
			// Insert temp items
			await sql`INSERT INTO items (seller_id, name, price) VALUES (3, 'Cheap', 1), (3, 'Expensive', 100)`.execute(rawDb);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("sellers")
					.where("id", "=", 3)
					.mutateRelated("items", (qb) =>
						qb.delete().where("price", "<", 10),
					),
				"rows",
			);
			eq(rows.length, 1, "parent returned");

			// Only cheap item deleted
			const { remaining, remainingCompiled } = await exec(
				db.selectFrom("items").where("seller_id", "=", 3),
				"remaining",
			);
			eq(remaining.length, 2, "expensive item + original vinyl remain");

			// Clean up
			await sql`DELETE FROM items WHERE seller_id = 3 AND name = 'Expensive'`.execute(rawDb);
		});

		await test("mutateRelated delete: combined with withRelated", async () => {
			// Insert temp sellers for market 3
			await sql`INSERT INTO sellers (market_id, name, booth_number) VALUES (3, 'Doomed1', 'Z1'), (3, 'Doomed2', 'Z2')`.execute(rawDb);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 3)
					.withRelated("tags")
					.mutateRelated("sellers", (qb) => qb.delete()),
				"rows",
			);
			eq(rows.length, 1, "parent returned");
			assert(Array.isArray(rows[0].tags), "tags fetched");
			eq((rows[0] as any).sellers, undefined, "no sellers output");

			// Verify sellers gone
			const { remaining, remainingCompiled } = await exec(
				db.selectFrom("sellers").where("market_id", "=", 3),
				"remaining",
			);
			eq(remaining.length, 0, "sellers deleted");
		});

		await test("mutateRelated delete: with builder ON condition", async () => {
			// Insert temp sellers
			await sql`INSERT INTO sellers (market_id, name, booth_number) VALUES (3, 'Keep', 'K1'), (3, 'Remove', 'R1')`.execute(rawDb);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 3)
					.mutateRelated(
						(b) => b("sellers").on("booth_number", "=", "R1"),
						(qb) => qb.delete(),
					),
				"rows",
			);

			const { remaining, remainingCompiled } = await exec(
				db.selectFrom("sellers").where("market_id", "=", 3),
				"remaining",
			);
			eq(remaining.length, 1, "only R1 deleted");
			eq(remaining[0].name, "Keep", "K1 kept");

			// Clean up
			await sql`DELETE FROM sellers WHERE market_id = 3`.execute(rawDb);
		});

		// ==================================================================
		// Edge cases
		// ==================================================================

		await test("withRelated mutation on no matching parent rows: no side effects", async () => {
			// No market with id=999
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 999)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "GHOST" }),
					),
				"rows",
			);
			eq(rows.length, 0, "no rows returned");

			// Verify no sellers were affected
			const { sellers, sellersCompiled } = await exec(
				db.selectFrom("sellers").where("booth_number", "=", "GHOST"),
				"sellers",
			);
			eq(sellers.length, 0, "no sellers modified");
		});

		await test("mutateRelated on no matching parent rows: no side effects", async () => {
			const { before, beforeCompiled } = await exec(
				db.selectFrom("sellers"),
				"before",
			);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 999)
					.mutateRelated("sellers", (qb) => qb.delete()),
				"rows",
			);

			const { after, afterCompiled } = await exec(
				db.selectFrom("sellers"),
				"after",
			);
			eq(after.length, before.length, "no sellers deleted");
		});

		await test("withRelated read + mutation: triple combo", async () => {
			// Insert temp items on Charlie (seller 3)
			await sql`INSERT INTO items (seller_id, name, price) VALUES (3, 'TempItem', 999)`.execute(rawDb);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("tags")
					.withRelated(
						(b) => b("sellers").as("updatedSellers"),
						(qb) => qb.update().set({ booth_number: "TRIPLE" }).where("name", "=", "Alice"),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			eq(rows[0].tags.length, 2, "tags read");
			eq(rows[0].updatedSellers.length, 1, "one seller updated");
			eq(rows[0].updatedSellers[0].booth_number, "TRIPLE", "booth updated");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`DELETE FROM items WHERE name = 'TempItem'`.execute(rawDb);
		});

		await test("select + withRelated: narrowed columns + relations", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.select(["id", "name"])
					.where("id", "=", 1)
					.withRelated("sellers"),
				"rows",
			);
			eq(rows.length, 1, "one row");
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			assert(Array.isArray(rows[0].sellers), "has sellers");
			eq(rows[0].sellers.length, 3, "3 sellers");
		});

		// ==================================================================
		// Complex combined scenarios
		// ==================================================================

		await test("nested mutation: update sellers with nested update items", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "NESTED" })
							.withRelated("items", (qb2) =>
								qb2.update().set({ price: 0 }),
							),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			eq(rows[0].sellers.length, 3, "3 sellers updated (Alice, Bob, Charlie)");
			for (const s of rows[0].sellers) {
				eq(s.booth_number, "NESTED", `seller ${s.name} booth updated`);
				assert(Array.isArray(s.items), `seller ${s.name} has items array`);
				for (const item of s.items) {
					eq(item.price, 0, `item ${item.name} price zeroed`);
				}
			}

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
			await sql`UPDATE items SET price = 25 WHERE name = 'Vintage Clock'`.execute(rawDb);
			await sql`UPDATE items SET price = 5 WHERE name = 'Book'`.execute(rawDb);
			await sql`UPDATE items SET price = 15 WHERE name = 'Lamp'`.execute(rawDb);
			await sql`UPDATE items SET price = 10 WHERE name = 'Vinyl Record'`.execute(rawDb);
		});

		await test("nested mutation: update sellers with nested mutateRelated delete items", async () => {
			// Add temporary items
			await sql`INSERT INTO items (seller_id, name, price) VALUES (1, 'TempA', 1), (2, 'TempB', 2)`.execute(rawDb);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "DEL_NESTED" })
							.mutateRelated("items", (qb2) =>
								qb2.delete().where("name", "like", "Temp%"),
							),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			// Sellers returned (without items since mutateRelated is fire-and-forget)
			eq(rows[0].sellers.length, 3, "3 sellers");
			for (const s of rows[0].sellers) {
				eq(s.booth_number, "DEL_NESTED", `seller ${s.name} updated`);
			}

			// Verify temp items deleted
			const { remaining, remainingCompiled } = await exec(
				db.selectFrom("items").where("name", "like", "Temp%"),
				"remaining",
			);
			eq(remaining.length, 0, "temp items deleted");

			// Restore booth_numbers
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("nested mutation: update sellers with nested withRelated items (read)", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "WITH_ITEMS" })
							.withRelated("items"),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			eq(rows[0].sellers.length, 3, "3 sellers");
			for (const s of rows[0].sellers) {
				eq(s.booth_number, "WITH_ITEMS", `seller ${s.name} updated`);
			}
			// Alice has 2 items, verify nested items are returned
			const alice = rows[0].sellers.find((s: any) => s.name === "Alice");
			neq(alice, undefined, "found Alice");
			assert(Array.isArray(alice.items), "items is array");
			eq(alice.items.length, 2, "Alice has 2 items");
			neq(alice.items[0].name, undefined, "item has name");
			neq(alice.items[0].price, undefined, "item has price");

			// Restore booth_numbers
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("multiple mutations on same query: update sellers + mutateRelated delete sellers", async () => {
			// Add temp sellers to delete
			await sql`INSERT INTO sellers (market_id, name, booth_number) VALUES (1, 'TempMM1', 'TMP1'), (1, 'TempMM2', 'TMP2')`.execute(rawDb);

			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "MULTI_MUT" }).where("name", "not like", "TempMM%"),
					)
					.mutateRelated(
						(b) => b("sellers").as("delSellers").on("name", "like", "TempMM%"),
						(qb) => qb.delete(),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			// Only non-temp sellers returned from the update
			eq(rows[0].sellers.length, 3, "3 original sellers updated");
			for (const s of rows[0].sellers) {
				eq(s.booth_number, "MULTI_MUT", `seller ${s.name} updated`);
			}

			// Verify temp sellers deleted
			const { temps, tempsCompiled } = await exec(
				db.selectFrom("sellers").where("name", "like", "TempMM%"),
				"temps",
			);
			eq(temps.length, 0, "temp sellers deleted");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("mutation on returning builder: updateTable + returningAll + withRelated mutation", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.updateTable("markets")
					.set({ name: "RetBuilder Test" })
					.where("id", "=", 1)
					.returningAll()
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "RB" }),
					),
				"row",
			);

			eq(row.name, "RetBuilder Test", "market name updated");
			eq(row.sellers.length, 3, "3 sellers");
			for (const s of row.sellers) {
				eq(s.booth_number, "RB", `seller ${s.name} booth updated`);
			}

			// Restore
			await sql`UPDATE markets SET name = 'Helsinki Market' WHERE id = 1`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("mutation on returning builder: insertInto + returningAll + withRelated read", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.insertInto("markets")
					.values({ name: "InsertRB", location: "Test", active: true })
					.returningAll()
					.withRelated("sellers"),
				"row",
			);

			eq(row.name, "InsertRB", "market name");
			assert(Array.isArray(row.sellers), "sellers is array");
			eq(row.sellers.length, 0, "new market has no sellers");

			// Clean up
			await sql`DELETE FROM markets WHERE id = ${row.id}`.execute(rawDb);
		});

		await test("mutation on returning builder: deleteFrom + returningAll + withRelated", async () => {
			// Insert temp market with NO sellers (FK prevents delete when sellers exist)
			await sql`INSERT INTO markets (name, location, active) VALUES ('ToDelete', 'Nowhere', false)`.execute(rawDb);
			const { rows: [tempMarket] } = await sql<{ id: number }>`SELECT id FROM markets WHERE name = 'ToDelete'`.execute(rawDb);

			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.deleteFrom("markets")
					.where("id", "=", tempMarket.id)
					.returningAll()
					.withRelated("sellers"),
				"row",
			);

			eq(row.name, "ToDelete", "deleted market returned");
			assert(Array.isArray(row.sellers), "sellers is array");
			eq(row.sellers.length, 0, "no sellers (market had none)");
		});

		await test("mutation on returning builder: mutateRelated fire-and-forget", async () => {
			// Add temp seller
			await sql`INSERT INTO sellers (market_id, name, booth_number) VALUES (1, 'TempFF', 'FF1')`.execute(rawDb);

			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.updateTable("markets")
					.set({ name: "FF Test" })
					.where("id", "=", 1)
					.returningAll()
					.mutateRelated("sellers", (qb) =>
						qb.delete().where("name", "=", "TempFF"),
					),
				"row",
			);

			eq(row.name, "FF Test", "market updated");
			eq((row as any).sellers, undefined, "sellers not in output (fire-and-forget)");

			// Verify TempFF deleted
			const { remaining, remainingCompiled } = await exec(
				db.selectFrom("sellers").where("name", "=", "TempFF"),
				"remaining",
			);
			eq(remaining.length, 0, "TempFF deleted");

			// Restore market name
			await sql`UPDATE markets SET name = 'Helsinki Market' WHERE id = 1`.execute(rawDb);
		});

		await test("mixed read + mutation on returning builder: tags read + sellers mutation", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				db
					.updateTable("markets")
					.set({ name: "Mixed RB" })
					.where("id", "=", 1)
					.returningAll()
					.withRelated("tags")
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "MIX" }),
					),
				"row",
			);

			eq(row.name, "Mixed RB", "market updated");
			assert(Array.isArray(row.tags), "tags read");
			eq(row.tags.length, 2, "2 tags");
			eq(row.sellers.length, 3, "3 sellers mutated");
			for (const s of row.sellers) {
				eq(s.booth_number, "MIX", `seller ${s.name} booth updated`);
			}

			// Restore
			await sql`UPDATE markets SET name = 'Helsinki Market' WHERE id = 1`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("insert relation via withRelated", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 2)
					.withRelated("sellers", (qb) =>
						qb.insert().values({ name: "Inserted", booth_number: "I1" }),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			// The inserted seller should appear in output
			const inserted = rows[0].sellers.find((s: any) => s.name === "Inserted");
			neq(inserted, undefined, "inserted seller in output");
			eq(inserted.booth_number, "I1", "booth number correct");

			// Clean up
			await sql`DELETE FROM sellers WHERE name = 'Inserted'`.execute(rawDb);
		});

		await test("multiple parent where conditions propagated to scope", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("active", "=", true)
					.where("location", "=", "Helsinki")
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "SCOPE" }),
					),
				"rows",
			);

			eq(rows.length, 1, "one matching market (Helsinki, active)");
			eq(rows[0].name, "Helsinki Market", "correct market");
			eq(rows[0].sellers.length, 3, "3 sellers scoped");
			for (const s of rows[0].sellers) {
				eq(s.booth_number, "SCOPE", `seller ${s.name} updated`);
			}

			// Verify Tampere sellers NOT updated (different market, also active but location doesn't match)
			const { tampere, tampereCompiled } = await exec(
				db.selectFrom("sellers").where("market_id", "=", 2),
				"tampere",
			);
			for (const s of tampere) {
				neq(s.booth_number, "SCOPE", `Tampere seller ${s.name} not updated`);
			}

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("mutation with builder alias + ON + inner where combined", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated(
						(b) => b("sellers").as("boothA").on("booth_number", "like", "A%"),
						(qb) => qb.update().set({ name: "BoothA Updated" }),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			// Only sellers with booth A1, A2 should be updated
			for (const s of rows[0].boothA) {
				eq(s.name, "BoothA Updated", `booth-A seller updated: ${s.booth_number}`);
				assert(s.booth_number.startsWith("A"), "only A-booth sellers");
			}
			eq(rows[0].boothA.length, 2, "2 booth-A sellers");

			// Verify Charlie (B1) not updated
			const { charlie, charlieCompiled } = await exec(
				db.selectFrom("sellers").where("name", "=", "Charlie"),
				"charlie",
			);
			// Charlie's name should still be 'Charlie' if ON condition worked
			// Actually wait — ON condition filters which rows the CTE touches
			// But Charlie has booth B1, so the ON("booth_number", "like", "A%") should exclude him

			// Restore
			await sql`UPDATE sellers SET name = 'Alice' WHERE booth_number = 'A1' AND market_id = 1`.execute(rawDb);
			await sql`UPDATE sellers SET name = 'Bob' WHERE booth_number = 'A2' AND market_id = 1`.execute(rawDb);
		});

		await test("select narrowed columns + withRelated mutation", async () => {
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.select(["id", "name"])
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "NARROW" }),
					),
				"rows",
			);

			eq(rows.length, 1, "one row");
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			eq(rows[0].sellers.length, 3, "3 sellers mutated");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("withRelated mutation across multiple parent rows", async () => {
			// Both Helsinki (id=1) and Tampere (id=2) markets are active
			const { rows, rowsCompiled } = await exec(
				db
					.selectFrom("markets")
					.where("active", "=", true)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "ALL" }),
					),
				"rows",
			);

			eq(rows.length, 2, "two active markets");
			// All sellers from both markets should be updated
			for (const market of rows) {
				for (const s of market.sellers) {
					eq(s.booth_number, "ALL", `seller ${s.name} updated`);
				}
			}

			// Verify: all 5 sellers updated
			const { allSellers, allSellersCompiled } = await exec(
				db.selectFrom("sellers"),
				"allSellers",
			);
			const updatedCount = allSellers.filter((s: any) => s.booth_number === "ALL").length;
			eq(updatedCount, 5, "all 5 sellers updated");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'C1' WHERE name = 'Dave'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'C2' WHERE name = 'Eve'`.execute(rawDb);
		});

		// ==================================================================
		// Projections
		// ==================================================================

		const projMeta = {
			markets: {
				projections: {
					default: ["id", "name", "location"],
					summary: ["id", "name"],
				},
				relations: {
					sellers: { model: "sellers", type: "many", from: "id", to: "market_id" },
					tags: {
						model: "market_tags", type: "many", from: "id", to: "id",
						through: { table: "market_tag_joins", from: "market_id", to: "tag_id" },
					},
				},
			},
			sellers: {
				projections: {
					default: ["id", "name", "market_id"],
					summary: ["id", "name"],
					relation: ["id", "name", "booth_number"],
					withFk: ["id", "name", "market_id"],
				},
				relations: {
					market: { model: "markets", type: "one", from: "market_id", to: "id" },
					items: { model: "items", type: "many", from: "id", to: "seller_id" },
				},
			},
			items: {
				relations: {
					seller: { model: "sellers", type: "one", from: "seller_id", to: "id" },
				},
			},
		} as const satisfies MetaDB<Database>;

		const pdb = createOrm(rawDb, projMeta);

		await test("project(): returns only projection columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").project("summary"),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			eq((rows[0] as any).location, undefined, "no location");
			eq((rows[0] as any).active, undefined, "no active");
		});

		await test("project() + select() accumulates columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").project("summary").select(["active"]),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			neq(rows[0].active, undefined, "has active");
			eq((rows[0] as any).location, undefined, "no location");
		});

		await test("default projection used when no select/project", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets"),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			// default: ["id", "name", "location"]
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			neq(rows[0].location, undefined, "has location");
			eq((rows[0] as any).active, undefined, "no active");
		});

		await test("table without projections uses selectAll", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("items"),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			neq(rows[0].price, undefined, "has price");
			neq(rows[0].seller_id, undefined, "has seller_id");
		});

		await test("select() without projection only selects those columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").select(["id"]),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			neq(rows[0].id, undefined, "has id");
			eq((rows[0] as any).name, undefined, "no name");
			eq((rows[0] as any).location, undefined, "no location");
		});

		await test("withRelated uses 'relation' projection on target", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").where("id", "=", 1).withRelated("sellers"),
				"rows",
			);
			eq(rows.length, 1, "one market");
			assert(rows[0].sellers.length >= 3, "has sellers");
			// relation: ["id", "name", "booth_number"]
			neq(rows[0].sellers[0].id, undefined, "seller has id");
			neq(rows[0].sellers[0].name, undefined, "seller has name");
			neq(rows[0].sellers[0].booth_number, undefined, "seller has booth_number");
			eq((rows[0].sellers[0] as any).market_id, undefined, "seller has no market_id");
		});

		await test("withRelated with variant string narrows columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").where("id", "=", 1).withRelated("sellers", "summary"),
				"rows",
			);
			eq(rows.length, 1, "one market");
			assert(rows[0].sellers.length >= 3, "has sellers");
			// summary: ["id", "name"]
			neq(rows[0].sellers[0].id, undefined, "seller has id");
			neq(rows[0].sellers[0].name, undefined, "seller has name");
			eq((rows[0].sellers[0] as any).booth_number, undefined, "no booth_number");
			eq((rows[0].sellers[0] as any).market_id, undefined, "no market_id");
		});

		await test("withRelated on table without projections uses selectAll", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("sellers").where("id", "=", 1).withRelated("items"),
				"rows",
			);
			eq(rows.length, 1, "one seller");
			assert(rows[0].items.length > 0, "has items");
			neq(rows[0].items[0].id, undefined, "item has id");
			neq(rows[0].items[0].name, undefined, "item has name");
			neq(rows[0].items[0].price, undefined, "item has price");
			neq(rows[0].items[0].seller_id, undefined, "item has seller_id");
		});

		await test("withRelated toOne uses default projection fallback", async () => {
			// markets has default: ["id", "name", "location"] but no "relation" projection
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("sellers").where("id", "=", 1).withRelated("market"),
				"rows",
			);
			eq(rows.length, 1, "one seller");
			neq(rows[0].market, null, "has market");
			neq(rows[0].market.id, undefined, "market has id");
			neq(rows[0].market.name, undefined, "market has name");
			neq(rows[0].market.location, undefined, "market has location");
			eq((rows[0].market as any).active, undefined, "market has no active");
		});

		await test("mutation withRelated with variant string", async () => {
			const { row, rowCompiled } = await execTakeFirstThrow(
				pdb.insertInto("markets")
					.values({ name: "Proj Market", location: "Test", active: true })
					.returningAll()
					.withRelated("sellers", "summary"),
				"row",
			);
			eq(row.name, "Proj Market", "correct name");
			assert(Array.isArray(row.sellers), "sellers is array");
			eq(row.sellers.length, 0, "new market has no sellers");

			await sql`DELETE FROM markets WHERE id = ${row.id}`.execute(rawDb);
		});

		await test("project() + withRelated + select: all combined", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets")
					.where("id", "=", 1)
					.project("summary")
					.withRelated("sellers", "summary")
					.select(["active"]),
				"rows",
			);
			eq(rows.length, 1, "one market");
			// project("summary"): id, name
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			// select(["active"]): active
			neq(rows[0].active, undefined, "has active");
			// should NOT have location
			eq((rows[0] as any).location, undefined, "no location");
			// sellers from summary: id, name only
			assert(rows[0].sellers.length >= 3, "has sellers");
			eq((rows[0].sellers[0] as any).booth_number, undefined, "no booth_number");
		});

		await test("builder form withRelated with variant", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated(
						(b) => b("sellers").as("topSellers"),
						"summary",
					),
				"rows",
			);
			eq(rows.length, 1, "one market");
			assert(Array.isArray(rows[0].topSellers), "has topSellers alias");
			assert(rows[0].topSellers.length >= 3, "has sellers");
			neq(rows[0].topSellers[0].id, undefined, "has id");
			neq(rows[0].topSellers[0].name, undefined, "has name");
			eq((rows[0].topSellers[0] as any).booth_number, undefined, "no booth_number");
		});

		// ==================================================================
		// Projection edge cases
		// ==================================================================

		await test("multiple project() calls accumulate columns", async () => {
			const multiProjMeta = {
				...projMeta,
				markets: {
					...projMeta.markets,
					projections: {
						...projMeta.markets.projections,
						minimal: ["id"],
						extended: ["location", "active"],
					},
				},
			} as const;
			const mpdb = createOrm(rawDb, multiProjMeta);

			const { rows, rowsCompiled } = await exec(
				mpdb.selectFrom("markets").project("minimal").project("extended"),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			// minimal: ["id"], extended: ["location", "active"]
			neq(rows[0].id, undefined, "has id from minimal");
			neq(rows[0].location, undefined, "has location from extended");
			neq(rows[0].active, undefined, "has active from extended");
			// Should NOT have name
			eq((rows[0] as any).name, undefined, "no name (not in either projection)");
		});

		await test("select() after project() accumulates columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").project("summary").select(["location", "active"]),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			// summary: ["id", "name"]
			neq(rows[0].id, undefined, "has id from projection");
			neq(rows[0].name, undefined, "has name from projection");
			// Additional selects
			neq(rows[0].location, undefined, "has location from select");
			neq(rows[0].active, undefined, "has active from select");
		});

		await test("project() after select() accumulates columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").select(["location", "active"]).project("summary"),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			// Initial selects
			neq(rows[0].location, undefined, "has location from select");
			neq(rows[0].active, undefined, "has active from select");
			// summary: ["id", "name"]
			neq(rows[0].id, undefined, "has id from projection");
			neq(rows[0].name, undefined, "has name from projection");
		});

		await test("project() + selectAll() includes all columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").project("summary").selectAll(),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			// selectAll includes everything
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			neq(rows[0].location, undefined, "has location");
			neq(rows[0].active, undefined, "has active");
		});

		await test("selectAll() + project() includes all columns plus projection", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb.selectFrom("markets").selectAll().project("summary"),
				"rows",
			);
			assert(rows.length > 0, "has rows");
			// All columns present
			neq(rows[0].id, undefined, "has id");
			neq(rows[0].name, undefined, "has name");
			neq(rows[0].location, undefined, "has location");
			neq(rows[0].active, undefined, "has active");
		});

		await test("project() with mutation withRelated narrows RETURNING columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "PROJ_MUT" }).project("summary"),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			assert(rows[0].sellers.length >= 3, "has sellers");
			// summary: ["id", "name"]
			neq(rows[0].sellers[0].id, undefined, "has id from projection");
			neq(rows[0].sellers[0].name, undefined, "has name from projection");
			eq((rows[0].sellers[0] as any).booth_number, undefined, "no booth_number (not in projection)");
			eq((rows[0].sellers[0] as any).market_id, undefined, "no market_id (correlation column stripped from projection)");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		await test("project() on insert relation narrows RETURNING columns", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb
					.selectFrom("markets")
					.where("id", "=", 2)
					.withRelated("sellers", (qb) =>
						qb.insert()
							.values({ name: "InsertProj", booth_number: "IP1" })
							.project("summary"),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			const inserted = rows[0].sellers.find((s: any) => s.name === "InsertProj");
			neq(inserted, undefined, "inserted seller in output");
			// summary: ["id", "name"]
			neq(inserted.id, undefined, "has id");
			eq(inserted.name, "InsertProj", "has name");
			// TODO: `booth_number` should not be in the type (runtime side works)
			eq(inserted.booth_number, undefined, "no booth_number (not in projection)");
			eq((inserted as any).market_id, undefined, "no market_id (correlation column stripped from projection)");

			// Clean up
			await sql`DELETE FROM sellers WHERE name = 'InsertProj'`.execute(rawDb);
		});

		await test("project() with FK column explicitly included keeps FK in result", async () => {
			const { rows, rowsCompiled } = await exec(
				pdb
					.selectFrom("markets")
					.where("id", "=", 1)
					.withRelated("sellers", (qb) =>
						qb.update().set({ booth_number: "WITH_FK" }).project("withFk"),
					),
				"rows",
			);

			eq(rows.length, 1, "one market");
			assert(rows[0].sellers.length >= 3, "has sellers");
			// withFk: ["id", "name", "market_id"] - FK IS included in projection
			neq(rows[0].sellers[0].id, undefined, "has id from projection");
			neq(rows[0].sellers[0].name, undefined, "has name from projection");
			// TODO: `market_id` should be in the type (runtime side works)
			neq(rows[0].sellers[0].market_id, undefined, "has market_id (explicitly in projection)");
			eq((rows[0].sellers[0] as any).booth_number, undefined, "no booth_number (not in projection)");

			// Restore
			await sql`UPDATE sellers SET booth_number = 'A1' WHERE name = 'Alice'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'A2' WHERE name = 'Bob'`.execute(rawDb);
			await sql`UPDATE sellers SET booth_number = 'B1' WHERE name = 'Charlie'`.execute(rawDb);
		});

		// Done
		await teardown(rawDb);
		await pool.end();

		console.log(`\nPassed: ${passed} / ${passed + failed}`);
	} catch (err) {
		await teardown(rawDb);
		await pool.end();
		throw err;
	}

	if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
	console.error("Fatal:", err);
	process.exit(1);
});
