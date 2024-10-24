import { container } from "@/container";
import { AccountController } from "../controller/account-controller";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { Router } from "express";
import asyncWrap from "@/libs/async-wrapper";

export class AccountRoutes {
  controller = container.get(AccountController);
  auth = container.get(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `/balance`,
      asyncWrap(this.auth.handle.bind(this.auth)),
      asyncWrap(this.controller.findBalance.bind(this.controller))
    );
  }
}
