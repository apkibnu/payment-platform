import { IAccount } from "./account";
import { IService } from "./service";
import { ITransactionType } from "./transaction-type";

export interface ITransaction {
  id?: string;
  invoiceNumber: string;
  serviceId?: string;
  service?: IService;
  transactionTypeId: string;
  transactionType?: ITransactionType;
  accountId: string;
  account?: IAccount;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionDTO {
  invoiceNumber: string;
  serviceCode: string;
  serviceName: string;
  transactionType: string;
  totalAmount: number;
  createdAt: Date;
}

export class Transaction {
  private props: ITransaction;
  constructor(props: ITransaction) {
    this.props = props;
  }

  public static create(props: ITransaction): Transaction {
    return new Transaction(props);
  }

  public unmarshal(): ITransaction {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      serviceId: this.serviceId,
      service: this.service,
      transactionTypeId: this.transactionTypeId,
      transactionType: this.transactionType,
      accountId: this.accountId,
      account: this.account,
      amount: this.amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get invoiceNumber(): string {
    return this.props.invoiceNumber;
  }

  get serviceId(): string | undefined {
    return this.props.serviceId;
  }

  get service(): IService | undefined {
    return this.props.service;
  }

  get transactionTypeId(): string {
    return this.props.transactionTypeId;
  }

  get transactionType(): ITransactionType | undefined {
    return this.props.transactionType;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get account(): IAccount | undefined {
    return this.props.account;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get amount(): number {
    return this.props.amount;
  }
}
