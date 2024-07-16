import { LibsqlError } from "@libsql/client";
import { userRepository } from "~~/server/repositories/userRepository";

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

    const deletedRows = await userRepository.delete(
      event.context.session.userId,
    );
    if (!deletedRows) {
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
