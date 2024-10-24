import { container, Injectable } from "@/container";
import { IAccount } from "@/domain/models/account";
import { AccountRepositoryInterface } from "@/domain/services/account-repository";

@Injectable()
export class AccountService {
  private accountRepository =
    container.get<AccountRepositoryInterface>("AccountRepository");

  async findBalance(id: string): Promise<IAccount> {
    const data = await this.accountRepository.findByUserId(id);
    return data.unmarshal();
  }
}
