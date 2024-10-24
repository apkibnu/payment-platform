import { container, Injectable } from "@/container";
import { TransactionService } from "@/service/transaction-service";
import { Response } from "express";
import {
  findHistoryScheme,
  paymentScheme,
  topUpScheme,
} from "../validation/transaction-validation";
import { AppError, HttpCode } from "@/libs/exception/app-error";
import { AuthRequest } from "../utils/jwt-request";

@Injectable()
export class TransactionController {
  private transactionService = container.get(TransactionService);

  async topUp(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = topUpScheme.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Error Validation",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const data = await this.transactionService.topUp(
      req.auth.user.id!,
      validatedReq.data.amount
    );
    return res
      .status(200)
      .json({ statusCode: 200, message: "success!", data: { balance: data } });
  }

  async payment(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = paymentScheme.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Error Validation",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const data = await this.transactionService.payment(
      req.auth.user.id!,
      validatedReq.data.serviceCode
    );
    return res
      .status(200)
      .json({ statusCode: 200, message: "success!", data: data });
  }

  public async findHistory(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = findHistoryScheme.safeParse({ ...req.query });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Error Validation",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const data = await this.transactionService.findHistory(
      req.auth.user.id!,
      validatedReq.data
    );
    return res.status(200).json({
      statusCode: 200,
      message: "success!",
      data: {
        offset: validatedReq.data.offset,
        limit: validatedReq.data.limit ? validatedReq.data.limit : data.length,
        data,
      },
    });
  }
}
