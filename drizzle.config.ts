import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./config/db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_AUTH_TOKEN!,
  },
});
