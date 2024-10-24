import { container } from "@/container";
import { ServiceController } from "../controller/service-controller";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { Router } from "express";
import asyncWrap from "@/libs/async-wrapper";

export class ServiceRoutes {
  controller = container.get(ServiceController);
  auth = container.get(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `/services`,
      asyncWrap(this.auth.handle.bind(this.auth)),
      asyncWrap(this.controller.findAll.bind(this.controller))
    );
  }
}
