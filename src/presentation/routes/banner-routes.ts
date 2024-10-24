import { container } from "@/container";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { Router } from "express";
import asyncWrap from "@/libs/async-wrapper";
import { BannerController } from "../controller/banner-controller";

export class BannerRoutes {
  controller = container.get(BannerController);
  auth = container.get(AuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `/banners`,
      asyncWrap(this.controller.findAll.bind(this.controller))
    );
  }
}
