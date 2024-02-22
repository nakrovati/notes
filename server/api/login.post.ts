import { eq, sql } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { email, string, parse, object } from "valibot";
import { db } from "~/db";
import { userTable } from "~/db/schema";

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
  } catch (error) {
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
  } catch (error) {
    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});
