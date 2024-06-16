import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    authToken: process.env.DB_AUTH_TOKEN!,
    url: process.env.DB_URL!,
  },
  driver: "turso",
  out: "./drizzle",
  schema: "./config/db/schema.ts",
});
