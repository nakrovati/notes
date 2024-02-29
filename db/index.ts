import { type Config, createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const config: Config =
  process.env.NODE_ENV === "production"
    ? {
        url: process.env.DB_URL!,
        authToken: process.env.DB_AUTH_TOKEN!,
      }
    : {
        url: "file:libsql.db",
      };

const client = createClient(config);

export const db = drizzle(client);
