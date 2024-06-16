import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    authToken: process.env.DB_AUTH_TOKEN!,
    url: process.env.DB_URL!,
  },
  dialect: "sqlite",
  driver: "turso",
  schema: "./config/db/schema.ts",
  strict: true,
  verbose: true,
});
