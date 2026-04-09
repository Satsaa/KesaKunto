# `db` Usage

Plain Postgres access for the app using:

- `kysely`
- `kysely-codegen`
- `kysely-is-an-orm`

There is no Supabase client layer in this package anymore.

## Database access

```ts
import { db } from 'db'

const markets = await db
  .selectFrom('flea_markets')
  .selectAll()
  .execute()
```

## Create your own instance

```ts
import { createDb } from 'db'

const db = createDb({
  connectionString: process.env.DATABASE_URL,
  applicationName: 'worker',
})
```

## ORM helpers

`db` supports the helpers from `kysely-is-an-orm`, including relation loading via the exported `meta`.

```ts
const products = await db
  .selectFrom('products')
  .withRelated('images')
  .execute()
```

## Codegen

Generate types from your Postgres schema:

```bash
npm run db:generate --workspace db
```

## Migrations

Create a migration:

```bash
npm run db:migration:new --workspace db add-users-table
```

Run all pending migrations:

```bash
npm run db:migrate --workspace db
```
