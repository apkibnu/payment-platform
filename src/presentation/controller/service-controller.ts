import { container, Injectable } from "@/container";
import { ServicePaymentService } from "@/service/service-service";
import { Request, Response } from "express";

@Injectable()
export class ServiceController {
  private servicePaymentService = container.get(ServicePaymentService);

  async findAll(_: Request, res: Response): Promise<Response> {
    const data = await this.servicePaymentService.findAll();
    return res
      .status(200)
      .json({ statusCode: 200, message: "success!", data: data });
  }
}
