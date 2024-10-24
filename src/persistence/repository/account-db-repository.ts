import { Injectable } from "@/container";
import { Account, IAccount } from "@/domain/models/account";
import { AccountRepositoryInterface } from "@/domain/services/account-repository";
import { client } from "@/infrastructure/database";
import { AppError } from "@/libs/exception/app-error";
import { Client } from "pg";

@Injectable()
export class AccountRepository implements AccountRepositoryInterface {
  private client: Client = client;

  async create(props: IAccount): Promise<Account> {
    const sql =
      "insert into accounts (id, user_id, balance, created_at, updated_at) values (gen_random_uuid(), $1, $2, now(), now()) returning *";
    const data = await this.client.query(sql, [props.userId, props.balance]);
    return Account.create({
      id: data.rows[0]["id"],
      userId: data.rows[0]["user_id"],
      balance: data.rows[0]["balance"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }

  async findByUserId(id: string, t: Boolean = false): Promise<Account> {
    const sql = !t
      ? "select * from accounts where user_id = $1"
      : "select * from accounts where user_id = $1 for update";
    const data = await this.client.query(sql, [id]);
    if (data.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "User not found!",
      });
    }
    return Account.create({
      id: data.rows[0]["id"],
      userId: data.rows[0]["user_id"],
      balance: data.rows[0]["balance"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }

  async updateAmount(id: string, amount: number): Promise<Account> {
    const sql = "select * from accounts where id = $1";
    const data = await this.client.query(sql, [id]);
    if (data.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "User not found!",
      });
    }

    const sqlUpdate =
      "update accounts set balance = $1, updated_at = now() where id = $2 returning *";
    const update = await this.client.query(sqlUpdate, [amount, id]);
    return Account.create({
      id: update.rows[0]["id"],
      userId: update.rows[0]["user_id"],
      balance: update.rows[0]["balance"],
      createdAt: update.rows[0]["created_at"],
      updatedAt: update.rows[0]["updated_at"],
    });
  }
}
