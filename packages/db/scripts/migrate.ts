import { FileMigrationProvider, Migrator } from "kysely";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../src/orm.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsPath = path.resolve(__dirname, "../migrations");

async function main() {
	const direction = process.argv[2] ?? "latest";
	const db = createDb({ applicationName: "tarjoushaukka-migrator", max: 1 });

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: migrationsPath,
		}),
	});

	try {
		const result =
			direction === "down"
				? await migrator.migrateDown()
				: await migrator.migrateToLatest();

		if (result.error) {
			console.error(result.error);
			process.exitCode = 1;
			return;
		}

		for (const migration of result.results ?? []) {
			console.log(`${migration.status} ${migration.migrationName}`);
		}
	} finally {
		await db.destroy();
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
