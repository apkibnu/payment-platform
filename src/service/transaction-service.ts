import { container, Injectable } from "@/container";
import { AccountRepositoryInterface } from "@/domain/services/account-repository";
import { ServiceRepositoryInterface } from "@/domain/services/service-repository";
import { TransactionTypeRepositoryInterface } from "@/domain/services/transaction-type-repository";
import { TransactionRepositoryInterface } from "@/domain/services/transaction-repository";
import { Client } from "pg";
import { client } from "@/infrastructure/database";
import { ITransactionDTO } from "@/domain/models/transaction";
import { AppError } from "@/libs/exception/app-error";
import moment from "moment";

@Injectable()
export class TransactionService {
  private accountRepository =
    container.get<AccountRepositoryInterface>("AccountRepository");
  private servicePaymentRepository =
    container.get<ServiceRepositoryInterface>("ServiceRepository");
  private transactionTypeRepository =
    container.get<TransactionTypeRepositoryInterface>(
      "TransactionTypeRepository"
    );
  private transactionRepository = container.get<TransactionRepositoryInterface>(
    "TransactionRepository"
  );
  private client: Client = client;

  async topUp(id: string, amount: number): Promise<number> {
    const date = moment().format("YYYYMMDD");
    let invoiceNumber;
    try {
      await this.client.query("BEGIN");
      const account = await this.accountRepository.findByUserId(id, true);
      const service = await this.servicePaymentRepository.findByCode("TOPUP");
      account.topUp(amount);
      await this.accountRepository.updateAmount(account.id!, account.balance);
      const transType = await this.transactionTypeRepository.findByName(
        "TOPUP"
      );
      const invoiceIndex =
        await this.transactionRepository.findLatestInvoiceNumber();
      if (invoiceIndex === 0) invoiceNumber = `INV${date}-0001`;
      else {
        const incrementNumber = Number(invoiceIndex) + 1;
        const incrementString = incrementNumber.toString();
        const paddedString = incrementString.padStart(4, "0");
        invoiceNumber = `INV${date}-${paddedString}`;
      }
      await this.transactionRepository.create({
        invoiceNumber,
        accountId: account.id!,
        serviceId: service.id!,
        transactionTypeId: transType.id!,
        amount: amount,
      });
      await this.client.query("COMMIT");
      return account.balance;
    } catch (error) {
      await this.client.query("ROLLBACK");
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError({
          statusCode: 500,
          description: "Failed to make payment!",
          error: error,
        });
      }
    }
  }

  async payment(id: string, serviceCode: string): Promise<ITransactionDTO> {
    const date = moment().format("YYYYMMDD");
    let invoiceNumber;
    try {
      await this.client.query("BEGIN");
      const account = await this.accountRepository.findByUserId(id, true);
      const service = await this.servicePaymentRepository.findByCode(
        serviceCode
      );
      account.payment(service.serviceTariff);
      await this.accountRepository.updateAmount(account.id!, account.balance);
      const transType = await this.transactionTypeRepository.findByName(
        "PAYMENT"
      );
      const invoiceIndex =
        await this.transactionRepository.findLatestInvoiceNumber();
      if (invoiceIndex === 0) invoiceNumber = `INV${date}-0001`;
      else {
        const incrementNumber = Number(invoiceIndex) + 1;
        const incrementString = incrementNumber.toString();
        const paddedString = incrementString.padStart(4, "0");
        invoiceNumber = `INV${date}-${paddedString}`;
      }
      const trans = await this.transactionRepository.create({
        invoiceNumber,
        accountId: account.id!,
        transactionTypeId: transType.id!,
        amount: service.serviceTariff,
        serviceId: service.id,
      });
      await this.client.query("COMMIT");
      return {
        invoiceNumber: trans.invoiceNumber,
        serviceCode: service.serviceCode,
        serviceName: service.serviceName,
        transactionType: transType.name,
        totalAmount: service.serviceTariff,
        createdAt: trans.createdAt!,
      };
    } catch (error) {
      await this.client.query("ROLLBACK");
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError({
          statusCode: 500,
          description: "Failed to make payment!",
          error: error,
        });
      }
    }
  }

  async findHistory(
    id: string,
    pagination: { limit?: number; offset: number }
  ): Promise<ITransactionDTO[]> {
    console.log(pagination);
    const data = await this.transactionRepository.findHistory(
      id,
      pagination.offset,
      pagination.limit
    );
    const resp = data.map((el) => {
      return {
        invoiceNumber: el.invoiceNumber,
        serviceCode: el.service?.serviceCode!,
        serviceName: el.service?.serviceName!,
        transactionType: el.transactionType?.name!,
        totalAmount: el.amount!,
        createdAt: el.createdAt!,
      };
    });
    return resp;
  }
}
