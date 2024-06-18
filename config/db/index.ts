import { type Config, createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const config: Config =
  process.env.NODE_ENV === "production"
    ? {
        authToken: process.env.DB_AUTH_TOKEN!,
        url: process.env.DB_URL!,
      }
    : {
        url: "file:libsql.db",
      };

const client = createClient(config);

export const db = drizzle(client, { schema });
