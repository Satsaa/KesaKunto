import { db } from "./models.js";

interface Debuggable {
	compile(): { sql: string; parameters: readonly unknown[] };
	execute(): Promise<any[]>;
}

async function debugQuery(label: string, query: Debuggable) {
	const { sql, parameters } = query.compile();
	console.log(`\n--- ${label} ---`);
	console.log("  SQL:    ", sql);
	console.log("  Params: ", parameters);
	const result = await query.execute();
	console.log("  Result: ", JSON.stringify(result, null, 4));
	return result;
}

// --- Basic: many relation ---
export async function getAllMarketsWithSellers() {
	return debugQuery(
		"All markets with sellers",
		db.selectFrom("markets").selectAll().withRelated("sellers"),
	);
}

// --- Basic: one relation ---
export async function getSellersWithMarket() {
	return debugQuery(
		"All sellers with their market",
		db.selectFrom("sellers").selectAll().withRelated("market"),
	);
}

// --- Filtered many relation (inner modifier) ---
export async function getMarketsWithFilteredSellers() {
	return debugQuery(
		"Markets — sellers in booth A* only",
		db
			.selectFrom("markets")
			.withRelated("sellers", (qb) => qb.where("booth_number", "like", "A%")),
	);
}

// --- Aliasing: same relation, two different filters ---
export async function getMarketsWithAliasedSellers() {
	return debugQuery(
		"Markets — boothA sellers + boothB sellers (aliased)",
		db
			.selectFrom("markets")
			.withRelated(
				(rel) => rel("sellers").as("boothA"),
				(qb) => qb.where("booth_number", "like", "A%"),
			)
			.withRelated(
				(rel) => rel("sellers").as("boothB"),
				(qb) => qb.where("booth_number", "like", "B%"),
			),
	);
}
