import { ITransaction, Transaction } from "../models/transaction";

export interface TransactionRepositoryInterface {
  create(props: ITransaction): Promise<Transaction>;
  findHistory(
    id: string,
    offset: number,
    limit?: number | null
  ): Promise<Transaction[]>;
  findLatestInvoiceNumber(): Promise<number>;
}
