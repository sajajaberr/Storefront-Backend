import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  password_digest?: string;
};

export class UserStore {
  // Get all users
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT id, username, firstname, lastname FROM users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get users: ${err}`);
    }
  }

  // Get user by ID
  async show(id: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT id, username, firstname, lastname FROM users WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();

      if (result.rows.length === 0) {
        throw new Error(`User with id ${id} not found`);
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get user ${id}: ${err}`);
    }
  }

  // Create new user
  async create(user: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO users (username, firstname, lastname, password_digest) VALUES($1, $2, $3, $4) RETURNING id, username, firstname, lastname";

      const hash = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );

      const result = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
        hash,
      ]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create user ${user.username}: ${err}`);
    }
  }

  // Authenticate user
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE username=($1)";
      const result = await conn.query(sql, [username]);
      conn.release();

      if (result.rows.length) {
        const user = result.rows[0];

        if (
          bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)
        ) {
          return user;
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Unable to authenticate user: ${err}`);
    }
  }

  // Delete user (optional, for testing)
  async delete(id: string): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        "DELETE FROM users WHERE id=($1) RETURNING id, username, firstname, lastname";
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to delete user ${id}: ${err}`);
    }
  }
}
