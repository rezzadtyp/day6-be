import { Router } from "express";
import { UserController } from "./user.controller";

export class UserRouter {
  private readonly router: Router = Router();

  constructor(private readonly userController: UserController) {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router.get("/", this.userController.getUsers);
    this.router.post("/register", this.userController.register);
  };

  getRouter(): Router {
    return this.router;
  }
}
