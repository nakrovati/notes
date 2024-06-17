import { LibsqlError } from "@libsql/client";
import { sql } from "drizzle-orm";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import * as v from "valibot";

import type { NewUser } from "~/types";

import { db } from "~/config/db";
import { userTable } from "~/config/db/schema";

const insertUser = db
  .insert(userTable)
  .values({
    createdAt: sql.placeholder("createdAt"),
    email: sql.placeholder("email"),
    id: sql.placeholder("id"),
    password: sql.placeholder("password"),
  })
  .prepare();

const SignupSchema = v.pipe(
  v.object({
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
    password_confirmation: v.string(),
  }),
  v.forward(
    v.check(
      (input) => input.password === input.password_confirmation,
      "Confirm password do not match",
    ),
    ["password_confirmation"],
  ),
);

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const creditnails = v.parse(SignupSchema, body);

    const hashedPassword = await new Argon2id().hash(creditnails.password);
    const userId = generateId(15);

    const newUser: NewUser = {
      createdAt: new Date().toISOString(),
      email: creditnails.email,
      id: userId,
      password: hashedPassword,
    };

    await insertUser.execute(newUser);

    const session = await lucia.createSession(userId, {});
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
      if (error.code === "SQLITE_CONSTRAINT") {
        throw createError({
          message: "Email already used",
          statusCode: 400,
        });
      }

      console.log(error);
    }

    throw error;
  }
});
