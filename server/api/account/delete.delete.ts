import { and, eq, sql } from "drizzle-orm";

import { db } from "~/db";
import { userTable } from "~/db/schema";

const deleteUser = db
  .delete(userTable)
  .where(and(eq(userTable.id, sql.placeholder("id"))))
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

    await deleteUser.execute({
      id: event.context.session.userId,
    });
  } catch {
    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});
