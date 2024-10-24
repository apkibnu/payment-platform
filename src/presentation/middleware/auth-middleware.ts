import { Injectable } from "@/container";
import { UserService } from "@/service/user-service";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../utils/jwt-request";
import { Auth } from "@/domain/models/auth";

@Injectable()
export class AuthMiddleware {
  constructor(private userService: UserService) {}
  public async handle(req: Request, _: Response, next: NextFunction) {
    const user = await this.userService.me(
      <string>req.get("Authorization")?.split(" ")?.[1] || ""
    );
    const newReq: AuthRequest = <AuthRequest>req;
    newReq.auth = Auth.create(user);
    next();
  }
}
