export interface IService {
  id?: string;
  serviceCode: string;
  serviceName: string;
  serviceIcon: string;
  serviceTariff: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Service {
  private props: IService;
  constructor(props: IService) {
    this.props = props;
  }

  public static create(props: IService): Service {
    return new Service(props);
  }

  public unmarshal(): IService {
    return {
      id: this.id,
      serviceCode: this.serviceCode,
      serviceName: this.serviceName,
      serviceIcon: this.serviceIcon,
      serviceTariff: this.serviceTariff,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get serviceCode(): string {
    return this.props.serviceCode;
  }

  get serviceName(): string {
    return this.props.serviceName;
  }

  get serviceIcon(): string {
    return this.props.serviceIcon;
  }

  get serviceTariff(): number {
    return this.props.serviceTariff;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
