import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "~/config/db";
import { type User, sessionTable, userTable } from "~/config/db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
});

declare module "lucia" {
  interface Register {
    DatabaseUserAttributes: Omit<User, "id">;
    Lucia: typeof lucia;
  }
}
