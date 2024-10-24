export interface ITransactionType {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TransactionType {
  private props: ITransactionType;
  constructor(props: ITransactionType) {
    this.props = props;
  }

  public static create(props: ITransactionType): TransactionType {
    return new TransactionType(props);
  }

  public unmarshal(): ITransactionType {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
