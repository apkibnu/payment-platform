import { container, Injectable } from "@/container";
import { IService } from "@/domain/models/service";
import { ServiceRepository } from "@/persistence/repository/service-db-repository";

@Injectable()
export class ServicePaymentService {
  private serviceRepo = container.get(ServiceRepository);

  async findAll(): Promise<IService[]> {
    const data = await this.serviceRepo.findAll();
    return data.map((el) => el.unmarshal());
  }

  async findById(id: string): Promise<IService> {
    const data = await this.serviceRepo.findById(id);
    return data.unmarshal();
  }
}
