import { Banner } from "../models/banner";

export interface BannerRepositoryInterface {
  findAll(): Promise<Banner[]>;
}
