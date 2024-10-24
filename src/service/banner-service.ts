import { container, Injectable } from "@/container";
import { IBanner } from "@/domain/models/banner";
import { BannerRepositoryInterface } from "@/domain/services/banner-repository";

@Injectable()
export class BannerService {
  private bannerRepository =
    container.get<BannerRepositoryInterface>("BannerRepository");

  async findAll(): Promise<IBanner[]> {
    const data = await this.bannerRepository.findAll();
    return data.map((el) => el.unmarshal());
  }
}
