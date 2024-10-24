import bcrypt from "bcryptjs";

export interface IUser {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private props: IUser;
  constructor(props: IUser) {
    this.props = props;
  }

  public static create(props: IUser): User {
    return new User(props);
  }

  public unmarshal(): IUser {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      profileImage: this.profileImage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public verifyPassword(password: string): boolean {
    if (this.password) {
      return bcrypt.compareSync(password, this.password);
    }
    return false;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string | undefined {
    return this.props.password;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get profileImage(): string | undefined {
    return this.props.profileImage;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
