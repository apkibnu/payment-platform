import { Injectable } from "@/container";
import { Service } from "@/domain/models/service";
import { ServiceRepositoryInterface } from "@/domain/services/service-repository";
import { client } from "@/infrastructure/database";
import { AppError } from "@/libs/exception/app-error";
import { Client } from "pg";

@Injectable()
export class ServiceRepository implements ServiceRepositoryInterface {
  private client: Client = client;

  async findAll(): Promise<Service[]> {
    const sql =
      "select service_code, service_name, service_icon, service_tariff from services where service_tariff is not null order by created_at";
    const data = await this.client.query(sql);
    return data.rows.map((el) =>
      Service.create({
        serviceCode: el["service_code"],
        serviceName: el["service_name"],
        serviceIcon: el["service_icon"],
        serviceTariff: el["service_tariff"],
      })
    );
  }

  async findById(id: string): Promise<Service> {
    const sql = "select * from services where id = $1";
    const data = await this.client.query(sql, [id]);
    if (data.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "Service not found!",
      });
    }
    return Service.create({
      id: data.rows[0]["id"],
      serviceCode: data.rows[0]["service_code"],
      serviceName: data.rows[0]["service_name"],
      serviceIcon: data.rows[0]["service_icon"],
      serviceTariff: data.rows[0]["service_tariff"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }

  async findByCode(code: string): Promise<Service> {
    const sql = "select * from services where service_code = $1";
    const data = await this.client.query(sql, [code]);
    if (data.rowCount === 0) {
      throw new AppError({
        statusCode: 404,
        description: "Service not found!",
      });
    }
    return Service.create({
      id: data.rows[0]["id"],
      serviceCode: data.rows[0]["service_code"],
      serviceName: data.rows[0]["service_name"],
      serviceIcon: data.rows[0]["service_icon"],
      serviceTariff: data.rows[0]["service_tariff"],
      createdAt: data.rows[0]["created_at"],
      updatedAt: data.rows[0]["updated_at"],
    });
  }
}
