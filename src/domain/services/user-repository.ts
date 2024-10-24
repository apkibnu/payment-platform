import { IUser, User } from "../models/user";

export interface UserRepositoryInterface {
  create(props: IUser): Promise<User>;
  findByEmail(email: string, login?: Boolean): Promise<User>;
  findById(id: string): Promise<User>;
  update(id: string, props: Partial<IUser>): Promise<User>;
  updateProfileImage(id: string, path: string): Promise<User>;
  checkEmail(email: string): Promise<Boolean>;
}
