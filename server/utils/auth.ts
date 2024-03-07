import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "~/config/db";
import { User, sessionTable, userTable } from "~/config/db/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    DatabaseUserAttributes: Omit<User, "id">;
    Lucia: typeof lucia;
  }
}
