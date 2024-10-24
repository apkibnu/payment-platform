import { Injectable } from "@/container";
import { Banner } from "@/domain/models/banner";
import { BannerRepositoryInterface } from "@/domain/services/banner-repository";
import { client } from "@/infrastructure/database";
import { Client } from "pg";

@Injectable()
export class BannerRepository implements BannerRepositoryInterface {
  private client: Client = client;

  async findAll(): Promise<Banner[]> {
    const sql =
      "select banner_name, banner_image, description from banners order by created_at";
    const data = await this.client.query(sql);
    return data.rows.map((el) =>
      Banner.create({
        bannerName: el["banner_name"],
        bannerImage: el["banner_image"],
        description: el["description"],
      })
    );
  }
}
