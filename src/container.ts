import "reflect-metadata";
import { UserRepository } from "./persistence/repository/user-db-repository";
import { UserRepositoryInterface } from "./domain/services/user-repository";
import { AuthMiddleware } from "./presentation/middleware/auth-middleware";
import { UserController } from "./presentation/controller/user-controller";
import { Routes } from "./presentation/routes/routes";
import { UserService } from "./service/user-service";
import { BannerRepositoryInterface } from "./domain/services/banner-repository";
import { BannerRepository } from "./persistence/repository/banner-db-repository";
import { BannerService } from "./service/banner-service";
import { BannerController } from "./presentation/controller/banner-controller";
import { ServiceRepositoryInterface } from "./domain/services/service-repository";
import { ServiceRepository } from "./persistence/repository/service-db-repository";
import { ServicePaymentService } from "./service/service-service";
import { ServiceController } from "./presentation/controller/service-controller";
import { AccountRepositoryInterface } from "./domain/services/account-repository";
import { AccountRepository } from "./persistence/repository/account-db-repository";
import { AccountService } from "./service/account-service";
import { AccountController } from "./presentation/controller/account-controller";
import { TransactionTypeRepositoryInterface } from "./domain/services/transaction-type-repository";
import { TransactionTypeRepository } from "./persistence/repository/transaction-type-db-repository";
import { TransactionRepositoryInterface } from "./domain/services/transaction-repository";
import { TransactionRepository } from "./persistence/repository/transaction-db-repository";
import { TransactionService } from "./service/transaction-service";
import { TransactionController } from "./presentation/controller/transaction-controller";

class Container {
  dependencies: { [key: string]: any } = {};
  bindings: { [key: string]: any } = {};

  // Bind an interface (or abstract class) to a concrete implementation
  bind<T>(interfaceToken: string, implementation: new (...args: any[]) => T) {
    this.bindings[interfaceToken] = implementation;
  }

  init(deps: any[]) {
    deps.forEach((target) => {
      const isInjectable = Reflect.getMetadata("injectable", target);
      if (!isInjectable) return;

      // Get the constructor parameter types (dependencies)
      const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];

      // Recursively resolve child dependencies
      const childrenDep = paramTypes.map((paramType: any) => {
        this.init([paramType]); // Ensure child dependencies are initialized
        const depName = paramType.name;

        // Check if paramType is bound to a concrete implementation
        const implementation = this.bindings[depName] || paramType;

        if (!this.dependencies[depName]) {
          this.dependencies[depName] = new implementation();
        }

        return this.dependencies[depName];
      });

      // Store the target class instance
      if (!this.dependencies[target.name]) {
        this.dependencies[target.name] = new target(...childrenDep);
      }
    });

    return this;
  }

  // Get dependency by class or interface token
  public get<T>(token: string | (new (...args: any[]) => T)): T {
    const tokenName = typeof token === "string" ? token : token.name;
    const implementation = this.dependencies[tokenName];

    // Throw error if dependency is not found
    if (!implementation) {
      throw new Error(
        `Dependency '${tokenName}' not found. Make sure it is registered and initialized.`
      );
    }

    return implementation;
  }
}

export function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata("injectable", true, target);
  };
}

const container = new Container();

// Repository
container.bind<UserRepositoryInterface>("UserRepository", UserRepository);
container.bind<BannerRepositoryInterface>("BannerRepository", BannerRepository);
container.bind<ServiceRepositoryInterface>(
  "ServiceRepository",
  ServiceRepository
);
container.bind<AccountRepositoryInterface>(
  "AccountRepository",
  AccountRepository
);
container.bind<TransactionTypeRepositoryInterface>(
  "TransactionTypeRepository",
  TransactionTypeRepository
);
container.bind<TransactionRepositoryInterface>(
  "TransactionRepository",
  TransactionRepository
);
container.init([
  UserRepository,
  BannerRepository,
  ServiceRepository,
  AccountRepository,
  TransactionTypeRepository,
  TransactionRepository,
]);

// Service
container.init([
  UserService,
  BannerService,
  ServicePaymentService,
  AccountService,
  TransactionService,
]);

// Controller
container.init([
  AuthMiddleware,
  UserController,
  BannerController,
  ServiceController,
  AccountController,
  TransactionController,
]);

// Routes
container.init([Routes]);

export { container };
