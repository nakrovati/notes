import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import { config } from "./index";

const client = createClient(config);
const db = drizzle(client);

await migrate(db, { migrationsFolder: "./drizzle" });

client.close();
