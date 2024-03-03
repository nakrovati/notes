# Notes

Web application for creating notes

Stack:

- Vue
- Nuxt
- Lucia
- Drizzle ORM
- Turso

Hosted on Vercel

## Development

Requirements:

1. Bun.js => v1.29
2. Turso database (for preview and production)

### Install dependencies

```
bun install
```

### Create local database

#### Generate SQL schema

Will create SQL files in the `./drizzle` directory with the creation of database tables from the database table schema defined in `./db/schema.ts`

```
bun run db:generate
```

#### Creating a database

Will create a database in the `libsql.db` file and run scripts in it from the SQL files created earlier.

```
bun run db:migrate
```

### Run the site locally

```
bun --bun run dev
```
