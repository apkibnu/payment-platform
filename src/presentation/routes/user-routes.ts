import { container } from "@/container";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { Router } from "express";
import asyncWrap from "@/libs/async-wrapper";
import { UserController } from "../controller/user-controller";
import multer from "multer";

export const tmpUploadedFiles = multer({
  dest: "tmp_uploaded_files/user",
});

export class UserRoutes {
  controller = container.get(UserController);
  auth = container.get(AuthMiddleware);

  public setRoutes(router: Router) {
    router.post(
      `/login`,
      asyncWrap(this.controller.login.bind(this.controller))
    );
    router.post(
      `/registration`,
      asyncWrap(this.controller.create.bind(this.controller))
    );
    router.get(`/profile`, asyncWrap(this.controller.me.bind(this.controller)));
    router.put(
      `/profile/update`,
      asyncWrap(this.auth.handle.bind(this.auth)),
      asyncWrap(this.controller.update.bind(this.controller))
    );
    router.put(
      `/profile/image`,
      asyncWrap(this.auth.handle.bind(this.auth)),
      tmpUploadedFiles.single("file"),
      asyncWrap(this.controller.updateImage.bind(this.controller))
    );
  }
}
