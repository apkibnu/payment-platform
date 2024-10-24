import { Injectable } from "@/container";
import { IUser, User } from "@/domain/models/user";
import { UserRepositoryInterface } from "@/domain/services/user-repository";
import { client } from "@/infrastructure/database";
import { AppError, HttpCode } from "@/libs/exception/app-error";
import { Client } from "pg";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  private client: Client = client;

  async findById(id: string): Promise<User> {
    const sql = "select * from users where id = $1";
    const data = await client.query(sql, [id]);
    return User.create({
      id: data.rows[0]["id"],
      email: data.rows[0]["email"],
      password: data.rows[0]["password"],
      firstName: data.rows[0]["first_name"],
      lastName: data.rows[0]["last_name"],
      profileImage: data.rows[0]["profile_image"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }

  async findByEmail(email: string, login: Boolean = false): Promise<User> {
    const sql = "select * from users where email = $1";
    const data = await client.query(sql, [email]);
    if (data.rowCount === 0) {
      if (login) {
        throw new AppError({
          statusCode: 401,
          description: "Wrong Credential!",
        });
      } else {
        throw new AppError({
          statusCode: 404,
          description: "User not found!",
        });
      }
    }
    return User.create({
      id: data.rows[0]["id"],
      email: data.rows[0]["email"],
      password: data.rows[0]["password"],
      firstName: data.rows[0]["first_name"],
      lastName: data.rows[0]["last_name"],
      profileImage: data.rows[0]["profile_image"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }

  async checkEmail(email: string): Promise<Boolean> {
    const sql = "select email from users where email = $1";
    const data = await client.query(sql, [email]);
    if (data.rowCount === 0) {
      return false;
    }
    return true;
  }

  async create(props: IUser): Promise<User> {
    try {
      const sqlUser =
        "insert into users (id, email, password, first_name, last_name, profile_image, created_at, updated_at) values (gen_random_uuid(), $1, $2, $3, $4, $5, now(), now()) returning *";
      const data = await this.client.query(sqlUser, [
        props.email,
        props.password,
        props.firstName,
        props.lastName,
        props.profileImage,
      ]);

      return User.create({
        id: data?.rows[0].id,
        email: data?.rows[0].email,
        password: data?.rows[0].password,
        firstName: data?.rows[0].first_name,
        lastName: data?.rows[0].last_name,
        profileImage: data?.rows[0].profile_image,
        createdAt: data?.rows[0].created_at,
        updatedAt: data?.rows[0].updated_at,
      });
    } catch (error: unknown) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create user",
        error: error,
      });
    }
  }

  async update(id: string, props: Partial<IUser>): Promise<User> {
    const sqlCheck = "select * from users where id = $1";
    const dataCheck = await client.query(sqlCheck, [id]);
    if (dataCheck.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "User not found!",
      });
    }
    const sqlUpdate =
      "update users set first_name = $2, last_name = $3, updated_at = now() where id = $1 returning *";
    const data = await this.client.query(sqlUpdate, [
      id,
      props.firstName,
      props.lastName,
    ]);
    return User.create({
      email: data.rows[0].email,
      firstName: data.rows[0].first_name,
      lastName: data.rows[0].last_name,
      profileImage: data.rows[0].profile_image,
    });
  }

  async updateProfileImage(id: string, path: string): Promise<User> {
    const sqlCheck = "select * from users where id = $1";
    const dataCheck = await client.query(sqlCheck, [id]);
    if (dataCheck.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "User not found!",
      });
    }
    const sqlUpdate =
      "update users set profile_image = $2, updated_at = now() where id = $1 returning *";
    const data = await this.client.query(sqlUpdate, [id, path]);
    return User.create({
      email: data.rows[0].email,
      firstName: data.rows[0].first_name,
      lastName: data.rows[0].last_name,
      profileImage: data.rows[0].profile_image,
    });
  }
}
