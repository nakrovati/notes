import { LibsqlError } from "@libsql/client";
import { and, eq, sql } from "drizzle-orm";

import { db } from "~/config/db";
import { userTable } from "~/config/db/schema";

const deleteUser = db
  .delete(userTable)
  .where(and(eq(userTable.id, sql.placeholder("id"))))
  .returning()
  .prepare();

export default eventHandler(async (event) => {
  try {
    if (!event.context.session) {
      throw createError({
        statusCode: 403,
      });
    }
    await lucia.invalidateSession(event.context.session.id);
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    );

    const deletedUsers = await deleteUser.execute({
      id: event.context.session.userId,
    });

    if (deletedUsers.length === 0) {
      throw createError({
        message: "User not found",
        statusCode: 404,
      });
    }

    setResponseStatus(event, 204);
  } catch (error) {
    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
