import { container, Injectable } from "@/container";
import { Auth, IAuth } from "@/domain/models/auth";
import { IUser } from "@/domain/models/user";
import { AccountRepositoryInterface } from "@/domain/services/account-repository";
import { UserRepositoryInterface } from "@/domain/services/user-repository";
import { client } from "@/infrastructure/database";
import { FileSystem } from "@/infrastructure/file-system/file-system";
import { AppError, HttpCode } from "@/libs/exception/app-error";
import { IMulterFile } from "@/presentation/validation/types";
import { userLoginScheme } from "@/presentation/validation/user-validation";
import bcrypt from "bcryptjs";
import { Client } from "pg";

@Injectable()
export class UserService {
  private userRepository =
    container.get<UserRepositoryInterface>("UserRepository");
  private accountRepository =
    container.get<AccountRepositoryInterface>("AccountRepository");
  private client: Client = client;

  public async login(props: typeof userLoginScheme._output): Promise<IAuth> {
    const user = await this.userRepository.findByEmail(props.email, true);
    if (!user.verifyPassword(props.password)) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Wrong Credential!",
      });
    }
    const auth = Auth.create({
      user: { ...user.unmarshal(), password: undefined },
    });
    return auth.unmarshal();
  }

  public async me(token: string): Promise<IAuth> {
    const auth = Auth.createFromToken(token);
    const user = await this.userRepository.findByEmail(auth.user.email);
    auth.user = {
      ...user.unmarshal(),
      password: undefined,
    };
    return auth.unmarshal();
  }

  public async create(props: IUser): Promise<IUser> {
    const check = await this.userRepository.checkEmail(props.email);
    if (check) {
      throw new AppError({
        statusCode: 400,
        description: "Email is already Registered!",
      });
    }
    try {
      await this.client.query("BEGIN");
      const data = await this.userRepository.create({
        ...props,
        password: props.password
          ? bcrypt.hashSync(props.password || "", 10)
          : undefined,
      });
      const unmarshalledData = data.unmarshal();
      await this.accountRepository.create({
        userId: unmarshalledData.id!,
        balance: 0,
      });
      await this.client.query("COMMIT");
      return unmarshalledData;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw new AppError({
        statusCode: 500,
        description: "Failed create User!",
        error: error,
      });
    }
  }

  public async update(id: string, props: Partial<IUser>): Promise<IUser> {
    const data = await this.userRepository.update(id, props);
    return data.unmarshal();
  }

  public async updateImage(
    id: string,
    file: IMulterFile,
    oldFile?: string
  ): Promise<IUser> {
    if (file === undefined) {
      throw new AppError({
        statusCode: 400,
        description: "Please input the image!",
      });
    }

    oldFile = oldFile ? "storage\\" + oldFile.split("/").join("\\") : undefined;
    const imagePath = FileSystem.update(file, "user", oldFile);
    const path = imagePath.split("\\").slice(1).join("/");
    const user = await this.userRepository.updateProfileImage(id, path);
    return user.unmarshal();
  }
}
