import { LibsqlError } from "@libsql/client";
import { hash } from "@node-rs/argon2";
import { userRepository } from "~~/server/repositories/userRepository";
import { SignUpSchema } from "~~/server/validators/userValidator";
import { generateIdFromEntropySize } from "lucia";
import * as v from "valibot";

import type { NewUser } from "~/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const creditnails = v.parse(SignUpSchema, body);
    const { email, password } = creditnails;

    const hashedPassword = await hash(password, {
      memoryCost: 4096 * 5, // 5MB
    });
    const userId = generateIdFromEntropySize(10);

    const newUser: NewUser = {
      email,
      id: userId,
      password: hashedPassword,
    };

    await userRepository.create(newUser);

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
          errors: v.flatten<typeof SignUpSchema>(error.issues).nested,
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
