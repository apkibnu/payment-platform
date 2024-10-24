import { container, Injectable } from "@/container";
import { Response } from "express";
import { AuthRequest } from "../utils/jwt-request";
import { AccountService } from "@/service/account-service";

@Injectable()
export class AccountController {
  private accountService = container.get(AccountService);

  async findBalance(req: AuthRequest, res: Response): Promise<Response> {
    const data = await this.accountService.findBalance(req.auth.user.id!);
    return res
      .status(200)
      .json({
        statusCode: 200,
        message: "success!",
        data: { balance: data.balance },
      });
  }
}
