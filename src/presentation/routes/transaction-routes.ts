import { container } from "@/container";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { Router } from "express";
import asyncWrap from "@/libs/async-wrapper";
import { TransactionController } from "../controller/transaction-controller";

export class TransactionRoutes {
  controller = container.get(TransactionController);
  auth = container.get(AuthMiddleware);

  public setRoutes(router: Router) {
    router.post(
      `/topup`,
      asyncWrap(this.auth.handle.bind(this.auth)),
      asyncWrap(this.controller.topUp.bind(this.controller))
    );
    router.post(
      `/transaction`,
      asyncWrap(this.auth.handle.bind(this.auth)),
      asyncWrap(this.controller.payment.bind(this.controller))
    );
    router.get(
      `/transaction/history`,
      asyncWrap(this.auth.handle.bind(this.auth)),
      asyncWrap(this.controller.findHistory.bind(this.controller))
    );
  }
}
