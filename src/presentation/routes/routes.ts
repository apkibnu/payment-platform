import { Router } from "express";
import { UserRoutes } from "./user-routes";
import { Injectable } from "@/container";
import { BannerRoutes } from "./banner-routes";
import { ServiceRoutes } from "./service-routes";
import { AccountRoutes } from "./account-routes";
import { TransactionRoutes } from "./transaction-routes";

@Injectable()
export class Routes {
  constructor(
    private userRoutes: UserRoutes,
    private bannerRoutes: BannerRoutes,
    private serviceRoutes: ServiceRoutes,
    private accountRoutes: AccountRoutes,
    private transactionRoutes: TransactionRoutes
  ) {}

  public setRoutes(router: Router) {
    this.userRoutes.setRoutes(router);
    this.bannerRoutes.setRoutes(router);
    this.serviceRoutes.setRoutes(router);
    this.accountRoutes.setRoutes(router);
    this.transactionRoutes.setRoutes(router);
  }
}
