import { container, Injectable } from "@/container";
import { BannerService } from "@/service/banner-service";
import { Request, Response } from "express";

@Injectable()
export class BannerController {
  private bannerService = container.get(BannerService);

  async findAll(_: Request, res: Response): Promise<Response> {
    const data = await this.bannerService.findAll();
    return res
      .status(200)
      .json({ statusCode: 200, message: "success!", data: data });
  }
}
