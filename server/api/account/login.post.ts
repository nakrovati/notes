import { LibsqlError } from "@libsql/client";
import { verify } from "@node-rs/argon2";
import { userRepository } from "~~/server/repositories/userRepository";
import { LoginSchema } from "~~/server/validators/userValidator";
import * as v from "valibot";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const creditnails = v.parse(LoginSchema, body);
    const { email, password } = creditnails;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return createError({
        data: {
          message: "Incorrect username or password",
        },
        statusCode: 400,
      });
    }

    const isPasswordValid = await verify(user.password, password);
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
