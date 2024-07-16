import { LibsqlError } from "@libsql/client";
import { userRepository } from "~~/server/repositories/userRepository";
import { LoginSchema } from "~~/server/validators/userValidator";
import { Argon2id } from "oslo/password";
import * as v from "valibot";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const creditnails = v.parse(LoginSchema, body);

    const user = await userRepository.findByEmail(creditnails.email);
    if (!user) {
      return createError({
        data: {
          message: "Incorrect username or password",
        },
        statusCode: 400,
      });
    }

    const isPasswordValid = await new Argon2id().verify(
      user.password,
      creditnails.password,
    );
    if (!isPasswordValid) {
      return createError({
        message: "Incorrect username or password",
        statusCode: 400,
      });
    }

    const session = await lucia.createSession(user.id, {});
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
