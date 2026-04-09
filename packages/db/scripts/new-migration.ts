import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsPath = path.resolve(__dirname, "../migrations");

function slugify(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function main() {
	const rawName = process.argv.slice(2).join(" ").trim();
	if (!rawName) {
		throw new Error("Migration name is required");
	}

	const name = slugify(rawName);
	const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
	const filename = `${timestamp}-${name}.ts`;
	const filepath = path.join(migrationsPath, filename);

	await fs.mkdir(migrationsPath, { recursive: true });
	await fs.writeFile(
		filepath,
		`import { Kysely, sql } from "kysely";
import type { Database } from "../src/generated/Database.js";

export async function up(db: Kysely<Database>): Promise<void> {
  await sql\`\`.execute(db);
}

export async function down(db: Kysely<Database>): Promise<void> {
  await sql\`\`.execute(db);
}
`,
		"utf8",
	);

	console.log(filepath);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
