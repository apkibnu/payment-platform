import { Account, IAccount } from "../models/account";

export interface AccountRepositoryInterface {
  findByUserId(id: string, t?: Boolean): Promise<Account>;
  updateAmount(id: string, amount: number): Promise<Account>;
  create(props: IAccount): Promise<Account>;
}
