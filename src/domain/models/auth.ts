import { AppError, HttpCode } from "@/libs/exception/app-error";
import { IUser, User } from "./user";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/libs/utils";

export interface IAuth {
  token?: string;
  user: IUser;
}

export class Auth {
  private props: IAuth;
  private constructor(props: IAuth) {
    this.props = {
      ...props,
      token:
        props.token || jwt.sign(props.user, JWT_SECRET, { expiresIn: "12h" }),
    };
  }
  public static create(props: IAuth): Auth {
    return new Auth(props);
  }
  public static createFromToken(token: string): Auth {
    try {
      const parsedAuth = <IUser>jwt.verify(token, JWT_SECRET);
      return new Auth({ user: parsedAuth, token: token });
    } catch (e) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Unauthorized",
      });
    }
  }
  public unmarshal(): IAuth {
    return {
      token: this.token,
      user: this.user.unmarshal(),
    };
  }
  get token(): string {
    return this.props.token || "";
  }
  get user(): User {
    return User.create(this.props.user);
  }
  set user(val: IUser) {
    this.props.user = val;
  }
}
