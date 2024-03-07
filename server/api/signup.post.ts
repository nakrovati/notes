import { LibsqlError } from "@libsql/client";
import { sql } from "drizzle-orm";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { custom, email, forward, object, parse, string } from "valibot";

import { db } from "~/db";
import { userTable } from "~/db/schema";

const insertUser = db
  .insert(userTable)
  .values({
    id: sql.placeholder("id"),
    email: sql.placeholder("email"),
    password: sql.placeholder("password"),
  })
  .prepare();

function validateBody(body: unknown) {
  const Schema = object(
    {
      email: string([email()]),
      password: string(),
      password_confirmation: string(),
    },
    [
      forward(
        custom(
          (input) => input.password === input.password_confirmation,
          "Confirm password do not match",
        ),
        ["password_confirmation"],
      ),
    ],
  );

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
    if (!creditnails) return new Error("Invalid body");

    const hashedPassword = await new Argon2id().hash(creditnails.password);
    const userId = generateId(15);

    await insertUser.execute({
      id: userId,
      email: creditnails.email,
      password: hashedPassword,
    });

    const session = await lucia.createSession(userId, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  } catch (error) {
    if (error instanceof LibsqlError && error.code === "SQLITE_CONSTRAINT") {
      throw createError({
        message: "Email already used",
        statusCode: 400,
      });
    }

    throw createError({
      message: "An unknown server error occured",
      statusCode: 500,
    });
  }
});
