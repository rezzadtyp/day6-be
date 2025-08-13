import { Router } from "express";
import { UserController } from "./user.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

export class UserRouter {
  private readonly router: Router = Router();

  constructor(private readonly userController: UserController) {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router.get("/", this.userController.getUsers);
    this.router.get(
      "/me",
      JwtMiddleware.verifyToken,
      this.userController.getMe
    );
    this.router.get("/:id", this.userController.getUserById);
    this.router.post("/register", this.userController.register);
    this.router.post("/login", this.userController.login);
  };

  public getRouter(): Router {
    return this.router;
  }
}
