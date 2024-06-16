import { LibsqlError } from "@libsql/client";
import { eq, sql } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import * as v from "valibot";

import { db } from "~/config/db";
import { userTable } from "~/config/db/schema";

const getUser = db
  .select({
    email: userTable.email,
    id: userTable.id,
    password: userTable.password,
  })
  .from(userTable)
  .where(eq(userTable.email, sql.placeholder("email")))
  .limit(1)
  .prepare();

const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.maxLength(320, "Must be at most 320 characters"),
    v.email("Invalid emial"),
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(8, "Must be at least 8 characters"),
    v.maxLength(50, "Must be at most 50 characters"),
  ),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const creditnails = v.parse(LoginSchema, body);

    const user = await getUser.execute({ email: creditnails.email });
    if (user.length === 0) {
      return createError({
        data: {
          message: "Incorrect username or password",
        },
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
    if (error instanceof v.ValiError) {
      throw createError({
        data: {
          errors: v.flatten(error.issues),
        },
        statusCode: 400,
      });
    }

    if (error instanceof LibsqlError) {
      console.log(error);
    }

    throw error;
  }
});
