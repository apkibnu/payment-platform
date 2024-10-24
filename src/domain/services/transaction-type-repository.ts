import { TransactionType } from "../models/transaction-type";

export interface TransactionTypeRepositoryInterface {
  findById(id: string): Promise<TransactionType>;
  findByName(name: string): Promise<TransactionType>;
}
