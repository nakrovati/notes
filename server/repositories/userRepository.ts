import { db } from "~~/config/db";
import { userTable } from "~~/config/db/schema";
import { eq, sql } from "drizzle-orm";

import type { NewUser, User } from "~/types";

class UserRepository {
  #preparedCreate = db
    .insert(userTable)
    .values({
      createdAt: sql.placeholder("createdAt"),
      email: sql.placeholder("email"),
      id: sql.placeholder("id"),
      password: sql.placeholder("password"),
    })
    .returning()
    .prepare();

  #preparedDelete = db
    .delete(userTable)
    .where(eq(userTable.id, sql.placeholder("id")))
    .prepare();

  #preparedFindByEmail = db.query.userTable
    .findFirst({ where: eq(userTable.email, sql.placeholder("email")) })
    .prepare();

  async create(user: NewUser): Promise<User> {
    const [createdUser] = await this.#preparedCreate.execute(user);
    return createdUser;
  }

  async delete(id: string): Promise<number> {
    const { rowsAffected } = await this.#preparedDelete.execute({ id });
    return rowsAffected;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.#preparedFindByEmail.execute({ email });
    return user;
  }
}

export const userRepository = new UserRepository();
