import { container, Injectable } from "@/container";
import { UserService } from "@/service/user-service";
import { Request, Response } from "express";
import {
  userImageUpdateScheme,
  userLoginScheme,
  userRegistrationScheme,
  userUpdateScheme,
} from "../validation/user-validation";
import { AppError, HttpCode } from "@/libs/exception/app-error";
import { AuthRequest } from "../utils/jwt-request";

@Injectable()
export class UserController {
  private userService = container.get(UserService);

  public async login(req: Request, res: Response): Promise<Response> {
    const validatedReq = userLoginScheme.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Error Validation",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const auth = await this.userService.login(validatedReq.data);
    return res
      .status(200)
      .json({ statusCode: HttpCode.OK, message: "success!", data: auth });
  }

  public async me(req: Request, res: Response): Promise<Response> {
    const auth = await this.userService.me(
      <string>req.get("Authorization")?.split(" ")[1]
    );
    const { id, createdAt, updatedAt, password, ...newData } = auth.user;
    return res.status(200).json({
      statusCode: HttpCode.OK,
      message: "success",
      data: newData,
    });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const validatedReq = userRegistrationScheme.safeParse({ ...req.body });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Error Validation",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const data = await this.userService.create(validatedReq.data);
    const { id, createdAt, updatedAt, profileImage, password, ...newData } =
      data;
    return res
      .status(200)
      .json({ statusCode: HttpCode.OK, message: "success!", data: newData });
  }

  public async update(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = userUpdateScheme.safeParse({ ...req.body });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Error Validation",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const data = await this.userService.update(
      req.auth.user.id!,
      validatedReq.data
    );
    const { id, createdAt, updatedAt, password, ...newData } = data;
    return res
      .status(200)
      .json({ statusCode: HttpCode.OK, message: "success!", data: newData });
  }

  public async updateImage(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = userImageUpdateScheme.safeParse({ file: req.file });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Error Validation",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    if (req.file?.size! > 5242880) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "File size exceed the limit!",
      });
    }
    if (
      req.file?.mimetype != "image/jpeg" &&
      req.file?.mimetype != "image/png"
    ) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "File format must be jpeg or png!",
      });
    }
    const data = await this.userService.updateImage(
      req.auth.user.id!,
      validatedReq.data.file,
      req.auth.user.profileImage!
    );
    const { id, createdAt, updatedAt, password, ...newData } = data;
    return res
      .status(200)
      .json({ statusCode: HttpCode.OK, message: "success!", data: newData });
  }
}
