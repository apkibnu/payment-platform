import { AppError, HttpCode } from "@/libs/exception/app-error";
import { IUser } from "./user";

export interface IAccount {
  id?: string;
  userId: string;
  user?: IUser;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Account {
  private props: IAccount;
  constructor(props: IAccount) {
    this.props = props;
  }

  public static create(props: IAccount): Account {
    return new Account(props);
  }

  public unmarshal(): IAccount {
    return {
      id: this.id,
      userId: this.userId,
      user: this.user,
      balance: this.balance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public topUp(amount: number): number {
    this.props.balance += amount;
    return this.balance;
  }

  public payment(amount: number): number | boolean {
    if (amount > this.balance) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Your balance is not sufficient!",
      });
    }
    this.props.balance -= amount;
    return this.balance;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get user(): IUser | undefined {
    return this.props.user;
  }

  get balance(): number {
    return this.props.balance;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
