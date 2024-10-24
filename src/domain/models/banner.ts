export interface IBanner {
  id?: string;
  bannerName: string;
  bannerImage: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Banner {
  private props: IBanner;
  constructor(props: IBanner) {
    this.props = props;
  }

  public static create(props: IBanner): Banner {
    return new Banner(props);
  }

  public unmarshal(): IBanner {
    return {
      id: this.id,
      bannerName: this.bannerName,
      bannerImage: this.bannerImage,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get bannerName(): string {
    return this.props.bannerName;
  }

  get bannerImage(): string {
    return this.props.bannerImage;
  }

  get description(): string {
    return this.props.description;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
