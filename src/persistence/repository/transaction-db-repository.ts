import { Injectable } from "@/container";
import { ITransaction, Transaction } from "@/domain/models/transaction";
import { TransactionRepositoryInterface } from "@/domain/services/transaction-repository";
import { client } from "@/infrastructure/database";
import moment from "moment";
import { Client } from "pg";

@Injectable()
export class TransactionRepository implements TransactionRepositoryInterface {
  private client: Client = client;

  async create(props: ITransaction): Promise<Transaction> {
    const sql =
      "insert into transactions (id, invoice_number, service_id, transaction_type_id, account_id, amount, created_at, updated_at) values (gen_random_uuid(), $1, $2, $3, $4, $5, now(), now()) returning *";
    const data = await this.client.query(sql, [
      props.invoiceNumber,
      props.serviceId,
      props.transactionTypeId,
      props.accountId,
      props.amount,
    ]);
    return Transaction.create({
      id: data.rows[0]["id"],
      invoiceNumber: data.rows[0]["invoice_number"],
      serviceId: data.rows[0]["service_id"],
      transactionTypeId: data.rows[0]["transaction_type_id"],
      accountId: data.rows[0]["account_id"],
      amount: data.rows[0]["amount"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }

  async findHistory(
    id: string,
    offset: number,
    limit?: number | null
  ): Promise<Transaction[]> {
    const sql =
      "select * from transactions join transaction_types on transactions.transaction_type_id = transaction_types.id join services on transactions.service_id = services.id join accounts on transactions.account_id = accounts.id where accounts.user_id = $1 order by transactions.created_at desc limit $2 offset $3";
    const data = await this.client.query(sql, [id, limit, offset]);
    return data.rows.map((el) =>
      Transaction.create({
        id: el["id"],
        invoiceNumber: el["invoice_number"],
        serviceId: el["service_id"],
        service: {
          serviceCode: el["service_code"],
          serviceName: el["service_name"],
          serviceIcon: el["service_icon"],
          serviceTariff: el["service_tariff"],
        },
        transactionTypeId: el["transaction_type_id"],
        transactionType: { name: el["name"] },
        accountId: el["account_id"],
        account: { userId: el["user_id"], balance: el["balance"] },
        amount: el["amount"],
        createdAt: el["created_at"],
      })
    );
  }

  async findLatestInvoiceNumber(): Promise<number> {
    const todayDate = moment().format("YYYY-MM-DD");
    const sql =
      "select invoice_number from transactions where date(created_at) = $1 order by created_at desc limit 1";
    const data = await this.client.query(sql, [todayDate]);
    if (data.rowCount === 0) return 0;
    const number: string = data.rows[0]["invoice_number"];
    return parseInt(number.substring(number.length - 4));
  }
}
