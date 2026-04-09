import "dotenv/config";
import { db } from "./models.js";
import { seed } from "./seed.js";
import {
	getAllMarketsWithSellers,
	getSellersWithMarket,
	getMarketsWithFilteredSellers,
	getMarketsWithAliasedSellers,
} from "./queries.js";

async function main() {
	console.log("Seeding database...");
	await seed(db as any);

	console.log("\nRunning playground queries...");
	await getAllMarketsWithSellers();
	await getSellersWithMarket();
	await getMarketsWithFilteredSellers();
	await getMarketsWithAliasedSellers();

	await db.destroy();
	console.log("\nDone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
