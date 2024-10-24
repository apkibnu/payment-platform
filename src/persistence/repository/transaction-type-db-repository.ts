import { Injectable } from "@/container";
import { TransactionType } from "@/domain/models/transaction-type";
import { TransactionTypeRepositoryInterface } from "@/domain/services/transaction-type-repository";
import { client } from "@/infrastructure/database";
import { AppError } from "@/libs/exception/app-error";
import { Client } from "pg";

@Injectable()
export class TransactionTypeRepository
  implements TransactionTypeRepositoryInterface
{
  private client: Client = client;

  async findById(id: string): Promise<TransactionType> {
    const sql = "select * from transaction_types where id = $1";
    const data = await this.client.query(sql, [id]);
    if (data.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "Transaction Type not found!",
      });
    }
    return TransactionType.create({
      id: data.rows[0]["id"],
      name: data.rows[0]["name"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }

  async findByName(name: string): Promise<TransactionType> {
    const sql = "select * from transaction_types where name = $1";
    const data = await this.client.query(sql, [name]);
    if (data.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "Transaction Type not found!",
      });
    }
    return TransactionType.create({
      id: data.rows[0]["id"],
      name: data.rows[0]["name"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }
}
