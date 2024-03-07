import { eq, sql } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { email, object, parse, string } from "valibot";

import { db } from "~/config/db";
import { userTable } from "~/config/db/schema";

const getUser = db
  .select({
    id: userTable.id,
    email: userTable.email,
    password: userTable.password,
  })
  .from(userTable)
  .where(eq(userTable.email, sql.placeholder("email")))
  .limit(1)
  .prepare();

function validateBody(body: unknown) {
  const Schema = object({
    email: string([email()]),
    password: string(),
  });

  try {
    return parse(Schema, body);
  } catch {
    return;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const creditnails = validateBody(body);
    if (!creditnails) throw new Error("Invalid body");

    const user = await getUser.execute({ email: creditnails.email });
    if (user.length === 0) {
      return createError({
        message: "Incorrect username or password",
        statusCode: 400,
      });
    }

    const isPasswordValid = await new Argon2id().verify(
      user[0].password,
      creditnails.password,
    );
    if (!isPasswordValid) {
      return createError({
        message: "Incorrect username or password",
        statusCode: 400,
      });
    }

    const session = await lucia.createSession(user[0].id, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  } catch {
    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});
