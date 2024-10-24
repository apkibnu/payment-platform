import { Service } from "../models/service";

export interface ServiceRepositoryInterface {
  findById(id: string): Promise<Service>;
  findAll(): Promise<Service[]>;
  findByCode(code: string): Promise<Service>;
}
